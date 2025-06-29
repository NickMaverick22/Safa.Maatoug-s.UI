export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'submittedAt'>): Promise<Testimonial | null> => {
  try {
    console.log('Adding testimonial with data:', testimonial);

    // Validate required fields
    if (!testimonial.name || !testimonial.quote) {
      throw new SecureError(
        'Le nom et le témoignage sont requis',
        'Name and testimonial are required fields',
        400
      );
    }

    // Validate field lengths to match RLS policy requirements
    if (testimonial.name.trim().length < 2 || testimonial.name.trim().length > 100) {
      throw new SecureError(
        'Le nom doit contenir entre 2 et 100 caractères',
        'Name length validation failed',
        400
      );
    }

    if (testimonial.quote.trim().length < 10 || testimonial.quote.trim().length > 1000) {
      throw new SecureError(
        'Le témoignage doit contenir entre 10 et 1000 caractères',
        'Testimonial length validation failed',
        400
      );
    }

    // Store current session to restore later if needed
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    console.log('Current session before submission:', currentSession ? 'authenticated' : 'anonymous');
    
    // If there's an authenticated session, temporarily sign out to ensure anonymous submission
    // This is required because the RLS policy only allows 'anon' role to insert testimonials
    if (currentSession) {
      console.log('Temporarily signing out authenticated user for anonymous submission');
      await supabase.auth.signOut();
    }

    // Prepare insert data - ensure status is 'pending' for RLS policy compliance
    const insertData = {
      name: testimonial.name.trim(),
      testimonial: testimonial.quote.trim(),
      status: 'pending', // Force pending status for RLS policy compliance
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Insert data:', insertData);

    const { data, error } = await supabase
      .from('testimonials')
      .insert(insertData)
      .select()
      .single();

    // Restore session if it existed before
    if (currentSession) {
      console.log('Restoring previous authenticated session');
      try {
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        });
      } catch (sessionError) {
        console.warn('Failed to restore session:', sessionError);
        // Don't throw here as the testimonial was successfully submitted
      }
    }

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Handle specific RLS policy violation
      if (error.code === '42501' || error.message.includes('row-level security policy')) {
        throw new SecureError(
          'Erreur de sécurité lors de la soumission. Veuillez vérifier que tous les champs sont remplis correctement.',
          `RLS policy violation: ${error.message}`,
          403
        );
      }
      
      // Handle missing required fields
      if (error.code === '23502') {
        throw new SecureError(
          'Données manquantes. Veuillez remplir tous les champs requis.',
          `Missing required field: ${error.message}`,
          400
        );
      }
      
      // Handle check constraint violations
      if (error.code === '23514') {
        throw new SecureError(
          'Les données ne respectent pas les critères requis. Vérifiez la longueur de vos textes.',
          `Check constraint violation: ${error.message}`,
          400
        );
      }
      
      throw new SecureError(
        'Erreur lors de l\'ajout du témoignage',
        `Supabase error: ${error.message}`,
        500
      );
    }

    console.log('Successfully inserted testimonial:', data);

    return {
      id: data.id,
      name: data.name,
      quote: data.testimonial,
      avatar: '', // Not stored in database
      status: data.status,
      submittedAt: new Date(data.created_at),
      reviewedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reviewedBy: '' // Not stored in database
    };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Une erreur inattendue s\'est produite lors de la soumission',
      `Unexpected error: ${error}`,
      500
    );
  }
};