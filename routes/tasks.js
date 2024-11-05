const express = require('express');
const { Task } = require('../models');
const redis = require('redis');
const router = express.Router();
const redisClient = redis.createClient();

// Adicionar nova tarefa
router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({ title });
    redisClient.del('tasks');  // Invalida cache de tarefas
    res.status(201).json(task);
});

// Listar todas as tarefas
router.get('/', async (req, res) => {
    redisClient.get('tasks', async (err, tasks) => {
        if (tasks) {
            return res.json(JSON.parse(tasks));
        } else {
            const allTasks = await Task.findAll();
            redisClient.setex('tasks', 3600, JSON.stringify(allTasks));
            res.json(allTasks);
        }
    });
});

// Atualizar status da tarefa
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.status = status || task.status;
    await task.save();
    redisClient.del('tasks');  // Invalida cache
    res.json(task);
});

// Remover tarefa
router.delete('/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    redisClient.del('tasks');  // Invalida cache
    res.status(204).send();
});

module.exports = router;
