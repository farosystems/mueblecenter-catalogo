-- Crear tabla stock_sucursales
CREATE TABLE IF NOT EXISTS stock_sucursales (
    id SERIAL PRIMARY KEY,
    fk_id_producto UUID NOT NULL,
    fk_id_zona INTEGER NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign keys
    FOREIGN KEY (fk_id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_id_zona) REFERENCES zonas(id) ON DELETE CASCADE,
    
    -- Constraint para evitar duplicados
    UNIQUE(fk_id_producto, fk_id_zona)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_stock_sucursales_producto ON stock_sucursales(fk_id_producto);
CREATE INDEX IF NOT EXISTS idx_stock_sucursales_zona ON stock_sucursales(fk_id_zona);
CREATE INDEX IF NOT EXISTS idx_stock_sucursales_stock_actual ON stock_sucursales(stock_actual);
CREATE INDEX IF NOT EXISTS idx_stock_sucursales_stock_minimo ON stock_sucursales(stock_minimo);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_stock_sucursales_updated_at 
    BEFORE UPDATE ON stock_sucursales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (stock por zonas)
-- Primero obtenemos algunos productos existentes para el ejemplo
INSERT INTO stock_sucursales (fk_id_producto, fk_id_zona, stock_actual, stock_minimo)
SELECT 
    p.id,
    z.id,
    -- Stock aleatorio entre 0 y 50
    FLOOR(RANDOM() * 51)::INTEGER as stock_actual,
    -- Stock mínimo aleatorio entre 5 y 15
    (FLOOR(RANDOM() * 11) + 5)::INTEGER as stock_minimo
FROM productos p
CROSS JOIN zonas z
ON CONFLICT (fk_id_producto, fk_id_zona) DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE stock_sucursales IS 'Tabla que almacena el stock de productos por zona/sucursal';
COMMENT ON COLUMN stock_sucursales.fk_id_producto IS 'ID del producto (referencia a tabla productos)';
COMMENT ON COLUMN stock_sucursales.fk_id_zona IS 'ID de la zona/sucursal (referencia a tabla zonas)';
COMMENT ON COLUMN stock_sucursales.stock_actual IS 'Stock actual disponible en esta zona';
COMMENT ON COLUMN stock_sucursales.stock_minimo IS 'Stock mínimo requerido para mostrar el producto';