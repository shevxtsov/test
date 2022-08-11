import maskInput from "../layout/maskInput"
import { whm } from "../tools"

export class Popup {
    /**
     * popup properties
     * @param {String} content type content wrapper
     */
    constructor(content = 'div') {
        this.div = null
        this.box = null
        this.header = null
        this.title = null
        this.body = null
        this.content = content
        this.items = []
        this.closeBtn = null
        this.overlay = null
        this.rowId = null
        this.groupId = null
        this.actions = null
    }

    /**
     * create popup object
     * @param {String} content popup wrapper
     * @returns popup object
     */
    static create(content) {
        const box = new Popup(content)
        box.prepare()
        box.render()

        return box
    }

    /**
     * clear popup content
     */
    clear() {
        whm.clear(this.content)
    }

    /**
     * prepare html template for popup
     */
    prepare() {
        const div = document.createElement('div')
        div.className = 'modal'

        const box = document.createElement('div')
        box.className = 'modal-box'

        const overlay = document.createElement('div')
        overlay.className = 'modal-overlay'

        const header = document.createElement('div')
        header.className = 'modal-box__header'
        header.id = 'modal-box__header'

        const title = document.createElement('h2')
        title.className = 'modal-box__title'
        title.id = 'modal-box__title'

        const close = document.createElement('button')
        close.className = 'modal-box__close'
        close.setAttribute('data-type', 'button')
        close.innerHTML = '<img src="images/close-icon-primary.svg" alt="">'

        const body = document.createElement('div')
        body.className = 'modal-box__content'
        body.id = 'modal-box__content'

        const content = document.createElement(this.content)

        this.div = div
        this.box = box
        this.overlay = overlay
        this.header = header
        this.title = title
        this.body = body
        this.content = content
        this.closeBtn = close
    }

    /**
     * render popup 
     */
    render() {
        this.header.appendChild(this.title)
        this.header.appendChild(this.closeBtn)
        this.box.appendChild(this.header)
        this.box.appendChild(this.body)
        this.div.appendChild(this.box)

        // this.close.addEventListener('click', this.hide.bind(this))
    }

    /**
     * set attributes for popup elements
     * @param {String} formId form ID
     */
    setData(formId) {
        this.content.setAttribute('data-form', formId)
        this.closeBtn.setAttribute('data-form', formId)
        this.closeBtn.setAttribute('data-evt', `${formId}:form-close`)
        this.closeBtn.setAttribute('data-close', 'yes')
        this.body.appendChild(this.content)
        this.box.setAttribute('id', formId)
    }

    /**
     * show popup 
     * @param {Object} form form data 
     * @param {HTMLElement} formData form template
     */
    show(form, formData) {
        const content = this.content
        let actions = null
        this.clear()
        this.setData(form.i)
        this.title.innerText = form.lbl

        actions = this.addActions(form)
        formData.appendChild(actions)

        content.appendChild(formData)

        this.display()
        maskInput.initMask('input[type=tel]')
    }

    /**
     * add popup form actions
     * @param {Object} form form
     * @returns popup form actions template
     */
    addActions(form) {
        const popupActions = document.createElement('ul')
        popupActions.className = 'btn-group btn-group--right is-hidden'
        popupActions.setAttribute('data-form-actions', true)

        form.actions.forEach((item) => {
            form.addItem(item, popupActions)
        })

        return popupActions
    }

    /**
     * display popup
     */
    display() {
        this.div.style.display = 'block'
        this.overlay.style.display = 'block'
        document.body.classList.add('is-blocked')
    }

    /**
     * hide popup
     */
    close() {
        this.hide()
    }

    /**
     * hide popup 
     */
    hide() {
        this.div.style.display = 'none'
        this.overlay.style.display = 'none'
        document.body.classList.remove('is-blocked')
    }
}