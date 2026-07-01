/* Room system — multiplayer via BroadcastChannel (same-machine tabs) */
window.RoomManager = class RoomManager {
  constructor() {
    this.channel = null
    this.roomCode = null
    this.playerId = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    this.playerName = ''
    this.members = []
    this.isHost = false
    this.onStateUpdate = null
    this.onMembersChange = null
    this.onHostLeave = null
  }

  createRoom(name) {
    this.playerName = name || 'Хост'
    this.roomCode = this._generateCode()
    this.isHost = true
    this.members = [{ id: this.playerId, name: this.playerName, isHost: true }]
    this._openChannel()
    this._broadcast({ type: 'room-info', code: this.roomCode, members: this.members })
    return this.roomCode
  }

  joinRoom(code, name) {
    this.roomCode = code.toUpperCase()
    this.playerName = name || 'Игрок'
    this.isHost = false
    this.members = []
    this._openChannel()
    this._broadcast({ type: 'hello', playerId: this.playerId, name: this.playerName })
    return true
  }

  leaveRoom() {
    if (this.channel) {
      this._broadcast({ type: 'leave', playerId: this.playerId })
      this.channel.close()
      this.channel = null
    }
    this.roomCode = null
    this.members = []
    this.isHost = false
  }

  broadcastState(gameState) {
    if (!this.isHost) return
    this._broadcast({ type: 'state', state: gameState })
  }

  requestChallenge(empId) {
    if (this.isHost) return
    this._broadcast({ type: 'challenge-req', playerId: this.playerId, empId })
  }

  submitChallenge(code) {
    this._broadcast({ type: 'challenge-submit', playerId: this.playerId, code })
  }

  _openChannel() {
    if (this.channel) this.channel.close()
    this.channel = new BroadcastChannel('cnc_' + this.roomCode)
    this.channel.onmessage = (e) => this._handle(e.data)
  }

  _handle(msg) {
    switch (msg.type) {
      case 'hello':
        if (this.isHost && msg.playerId !== this.playerId) {
          if (!this.members.find(m => m.id === msg.playerId)) {
            this.members.push({ id: msg.playerId, name: msg.name, isHost: false })
            this._broadcast({ type: 'room-info', code: this.roomCode, members: this.members })
            if (this.onMembersChange) this.onMembersChange(this.members)
          }
        }
        break

      case 'room-info':
        if (!this.isHost) {
          this.members = msg.members
          if (this.onMembersChange) this.onMembersChange(this.members)
          this._broadcast({ type: 'sync-req', playerId: this.playerId })
        }
        break

      case 'sync-req':
        if (this.isHost && msg.playerId !== this.playerId) {
          if (this.__syncState) this._broadcast({ type: 'state', state: this.__syncState })
        }
        break

      case 'state':
        if (!this.isHost && this.onStateUpdate) {
          this.__cachedState = msg.state
          this.onStateUpdate(msg.state)
        }
        break

      case 'challenge-req':
        if (this.isHost && msg.playerId !== this.playerId && this.onChallengeRequest) {
          this.onChallengeRequest(msg.empId, msg.playerId)
        }
        break

      case 'challenge-data':
        if (!this.isHost && this.onChallengeData) {
          this.onChallengeData(msg.challenge)
        }
        break

      case 'challenge-submit':
        if (this.isHost && msg.playerId !== this.playerId && this.onChallengeSubmit) {
          this.onChallengeSubmit(msg.code, msg.playerId)
        }
        break

      case 'challenge-result':
        if (!this.isHost && this.onChallengeResult) {
          this.onChallengeResult(msg.solved)
        }
        break

      case 'leave':
        if (this.isHost && msg.playerId !== this.playerId) {
          this.members = this.members.filter(m => m.id !== msg.playerId)
          if (this.members.length === 0) {
            this.members.push({ id: this.playerId, name: this.playerName, isHost: true })
          }
          this._broadcast({ type: 'room-info', code: this.roomCode, members: this.members })
          if (this.onMembersChange) this.onMembersChange(this.members)
        } else if (!this.isHost && msg.playerId === this.members.find(m => m.isHost)?.id) {
          if (this.onHostLeave) this.onHostLeave()
        }
        break
    }
  }

  _broadcast(msg) {
    try { this.channel?.postMessage(msg) } catch (e) { /* ignore */ }
  }

  _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
    return code
  }
}
