const ws = new WebSocket('ws://localhost:2080/api/chat');

ws.onopen = () => {
  console.log('WebSocket connected');
  const message = {
    type: 'authenticate',
    token: 'your_jwt_token_here',  // Replace with a valid JWT token
  };
  ws.send(JSON.stringify(message));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
