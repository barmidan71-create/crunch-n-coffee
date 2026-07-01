/* Custom code editor with auto-indent and bracket closing */

window.CustomEditor = class CustomEditor {
  constructor(container, opts = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container
    this.readOnly = opts.readOnly || false
    this._value = opts.value || ''
    this.onInput = opts.onInput || null
    this._render()
    this._attachEvents()
    this.setValue(this._value)
  }

  _render() {
    this.container.innerHTML = `
      <div class="custom-editor">
        <div class="editor-gutter" data-part="gutter"></div>
        <textarea class="editor-textarea" spellcheck="false" ${this.readOnly ? 'readonly' : ''}></textarea>
      </div>`
    this.gutter = this.container.querySelector('.editor-gutter')
    this.textarea = this.container.querySelector('.editor-textarea')
  }

  _attachEvents() {
    if (this.readOnly) return
    this.textarea.addEventListener('input', () => this._sync())
    this.textarea.addEventListener('keydown', e => this._handleKey(e))
    this.textarea.addEventListener('scroll', () => this.gutter.scrollTop = this.textarea.scrollTop)
  }

  _sync() {
    this._value = this.textarea.value
    this._updateGutter()
    if (this.onInput) this.onInput(this._value)
  }

  _updateGutter() {
    const lines = this.textarea.value.split('\n').length
    this.gutter.innerHTML = Array.from({ length: lines }, (_, i) =>
      `<span>${i + 1}</span>`
    ).join('')
  }

  _handleKey(e) {
    const ta = this.textarea
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const val = ta.value
    const lineStart = val.lastIndexOf('\n', start - 1) + 1
    const currentLine = val.slice(lineStart, val.indexOf('\n', start) === -1 ? val.length : val.indexOf('\n', start))
    const indent = currentLine.match(/^(\s*)/)[1]

    if (e.key === 'Tab') {
      e.preventDefault()
      const before = val.slice(0, start)
      const after = val.slice(end)
      ta.value = before + '  ' + after
      ta.selectionStart = ta.selectionEnd = start + 2
      this._sync()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const before = val.slice(0, start)
      const after = val.slice(end)
      const ins = '\n' + indent
      ta.value = before + ins + after
      ta.selectionStart = ta.selectionEnd = start + ins.length
      this._sync()
      return
    }

    const pairs = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" }
    if (pairs[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      const close = pairs[e.key]
      const before = val.slice(0, start)
      const after = val.slice(end)
      ta.value = before + e.key + close + after
      ta.selectionStart = ta.selectionEnd = start + 1
      this._sync()
      return
    }

    if ((e.key === 'Backspace' || e.key === 'Delete') && !e.ctrlKey && !e.metaKey) {
      const charBefore = val[start - 1]
      const charAfter = val[start]
      for (const [open, close] of Object.entries(pairs)) {
        if (charBefore === open && charAfter === close) {
          e.preventDefault()
          ta.value = val.slice(0, start - 1) + val.slice(start + 1)
          ta.selectionStart = ta.selectionEnd = start - 1
          this._sync()
          return
        }
      }
    }
  }

  getValue() {
    return this._value
  }

  setValue(v) {
    this._value = v || ''
    this.textarea.value = this._value
    this._updateGutter()
  }

  focus() {
    this.textarea.focus()
  }

  dispose() {
    this.container.innerHTML = ''
  }
}
