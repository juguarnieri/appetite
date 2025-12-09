const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const path = require('path');

// ...existing upload config...

// GET todas as receitas
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT r.*, c.nome as categoria_nome
      FROM receitas r
      LEFT JOIN categorias c ON r.categoria_id = c.id
      ORDER BY r.data_criacao DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    res.status(500).json({ error: 'Erro ao buscar receitas' });
  }
});

// GET receita por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT r.*, c.nome as categoria_nome
      FROM receitas r
      LEFT JOIN categorias c ON r.categoria_id = c.id
      WHERE r.id = $1
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
});

// POST nova receita
router.post('/', async (req, res) => {
  try {
    const { 
      titulo, 
      descricao, 
      ingredientes, 
      modo_preparo, 
      tempo_preparo, 
      categoria_id, 
      dificuldade, 
      usuario_id,
      avaliacao 
    } = req.body;

    let imagem = null;
    if (req.file) {
      imagem = req.file.filename;
    }

    // Validações
    if (!titulo || !categoria_id || !dificuldade) {
      return res.status(400).json({ 
        error: 'Título, categoria e dificuldade são obrigatórios' 
      });
    }

    // Garantir que categoria_id é um número válido
    const catId = parseInt(categoria_id);
    if (isNaN(catId) || catId < 1 || catId > 5) {
      return res.status(400).json({ 
        error: 'Categoria inválida. Use ID entre 1 e 5' 
      });
    }

    const query = `
      INSERT INTO receitas (
        titulo, 
        descricao, 
        ingredientes, 
        modo_preparo, 
        imagem, 
        tempo_preparo, 
        categoria_id, 
        dificuldade, 
        usuario_id,
        avaliacao,
        favorita
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false)
      RETURNING *
    `;

    const result = await db.query(query, [
      titulo,
      descricao || null,
      ingredientes || null,
      modo_preparo || null,
      imagem,
      tempo_preparo || 0,
      catId,
      dificuldade,
      usuario_id || 1,
      avaliacao || 0
    ]);

    console.log('✅ Receita criada:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Uma receita com este título já existe',
        details: error.detail 
      });
    }
    console.error('Erro ao criar receita:', error);
    res.status(500).json({ error: 'Erro ao criar receita' });
  }
});

// ...existing update and delete routes...

module.exports = router;
