// Funcion que busca en una string la palabra CATALOGO y se queda con la palabra que este detras de ella

export const getCatalogo = (str: string) => {
    const catalogoIndex = str.indexOf("CATALOGO");
    if (catalogoIndex === -1) return "";

    // Extraer la parte de la cadena antes de "CATALOGO"
    const beforeCatalogo = str.slice(0, catalogoIndex).trim();

    // Obtener la última palabra antes de "CATALOGO"
    const words = beforeCatalogo.split(/\s+/); // Divide por espacios múltiples
    return words[words.length - 1]; // Retorna la última palabra
};
