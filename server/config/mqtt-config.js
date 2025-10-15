const brokerConfig = {
  host: 'mqtt://broker.emqx.io',
  options: {
    clientId: 'backend_service_' + Math.random().toString(16).substr(2, 8),
    clean: true,
  }
};

module.exports = brokerConfig;
