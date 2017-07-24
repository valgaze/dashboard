# Websockets event pusher

Listens to a websocket. When events are received, emit them as events. Used to push real-time
updates to collections from a server.

```javascript
websocketsEventPusher.setHost('ws://localhost:8080');
websocketsEventPusher.setToken('tok_XXX');

// Now, listen for events. For example:
pusher.on('connected', () => console.log('Connected to socket!'));

// This event is emitted when a space updates.
pusher.on('space', space => console.log('Update to space:', space));
```
