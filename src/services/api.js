
const API_URL = 'http://localhost:3000';

// Funciones de Autor
export const crearAutor = async (autorData) => {
    try {
        const response = await fetch(`${API_URL}/autores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(autorData),
        });
        if (!response.ok) {
            throw new Error('Error al crear el autor');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getAutores = async () => {
    try {
        const response = await fetch(`${API_URL}/autores`);
        if (!response.ok) {
            throw new Error('Error al obtener los autores');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Funciones de Libro
export const crearLibro = async (libroData) => {
    try {
        const response = await fetch(`${API_URL}/libros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libroData),
        });
        if (!response.ok) {
            throw new Error('Error al crear el libro');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getLibrosPorAutor = async (autorId) => {
    try {
        const response = await fetch(`${API_URL}/autores/${autorId}/libros`);
        if (!response.ok) {
            throw new Error('Error al obtener los libros del autor');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getLibrosPorEditorial = async (editorialId) => {
    try {
        const response = await fetch(`${API_URL}/editoriales/${editorialId}/libros`);
        if (!response.ok) {
            throw new Error('Error al obtener los libros de la editorial');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const actualizarPrecio = async (libroId, nuevoPrecio) => {
    try {
        const response = await fetch(`${API_URL}/libros/${libroId}/actualizar-precio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nuevoPrecio }),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el precio');
        }
        return await response.json();

    } catch (error) {
        console.error(error);
        return null;
    }
};

export const eliminarLibro = async (libroId) => {
    try {
        const response = await fetch(`${API_URL}/libros/${libroId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el libro');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Funciones de Venta
export const crearVenta = async (ventaData) => {
    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });
        if (!response.ok) {
            throw new Error('Error al crear la venta');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const eliminarVenta = async (ventaId) => {
    try {
        const response = await fetch(`${API_URL}/ventas/${ventaId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la venta');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};
