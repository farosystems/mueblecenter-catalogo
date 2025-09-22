-- Insertar configuración inicial
INSERT INTO public.configuracion (telefono, logo)
VALUES ('5491123365608', '/LOGO BLANCO.png')
ON CONFLICT (id) DO UPDATE SET
  telefono = EXCLUDED.telefono,
  logo = EXCLUDED.logo,
  created_at = now();

-- Verificar que se insertó correctamente
SELECT * FROM public.configuracion;
