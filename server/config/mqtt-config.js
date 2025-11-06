const brokerConfig = {
  host: 'mqtt://broker.hivemq.com:1883',
  options: {
    clientId: 'backend_service_' + Math.random().toString(16).substr(2, 8),
    clean: true,
  }
};

module.exports = brokerConfig;
