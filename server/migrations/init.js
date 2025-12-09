const db = require('../database'); // sua conexão com o banco

async function initializeDatabase() {
  try {
    // Criar índices
    await db.query(`CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_favoritos_receita ON favoritos(receita_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_receitas_categoria ON receitas(categoria_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_receitas_usuario ON receitas(usuario_id)`);

    // Inserir categorias
    const categorias = [
      { id: 1, nome: 'Sobremesas' },
      { id: 2, nome: 'Lanches' },
      { id: 3, nome: 'Diets' },
      { id: 4, nome: 'Vegetariano' },
      { id: 5, nome: 'Bebidas' }
    ];

    for (const categoria of categorias) {
      await db.query(
        'INSERT INTO categorias (id, nome) VALUES (?, ?) ON CONFLICT DO NOTHING',
        [categoria.id, categoria.nome]
      );
    }

    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

module.exports = { initializeDatabase };
