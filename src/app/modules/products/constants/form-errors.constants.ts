export const PRODUCT_FORM_ERRORS: Record<string, Record<string, string>> = {
  id: {
    required: 'ID es requerido!',
    minlength: 'Mínimo 3 caracteres!',
    maxlength: 'Máximo 10 caracteres!',
    idExists: 'ID no válido!'
  },
  name: {
    required: 'Nombre es requerido!',
    // NOTE: Adjusted to 6 chars to match backend validation (document specifies 5, but backend requires 6)
    minlength: 'Mínimo 6 caracteres!',
    maxlength: 'Máximo 100 caracteres!'
  },
  description: {
    required: 'Descripción es requerida!',
    minlength: 'Mínimo 10 caracteres!',
    maxlength: 'Máximo 200 caracteres!'
  },
  logo: {
    required: 'Logo es requerido!'
  },
  releaseDate: {
    required: 'Fecha de liberación es requerida!',
    minDate: 'La fecha debe ser igual o mayor a hoy!'
  },
  revisionDate: {
    required: 'Fecha de revisión es requerida!'
  }
};
