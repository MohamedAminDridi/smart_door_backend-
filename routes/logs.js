router.post('/logs', async (req, res) => {
    try {
      const { doorId, status, timestamp } = req.body;
  
      const newLog = new Log({
        doorId,
        status,
        timestamp
      });
  
      await newLog.save();
  
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ message: 'Error creating log', error });
    }
  });