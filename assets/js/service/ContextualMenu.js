import {Icons} from "./Icons.js";


export default function contextualMenu (event) {

    /** Remove all existing menus if exist */
    const existingMenus = document.querySelectorAll('.contextual-menu')
    existingMenus.forEach(menu => {
        menu.remove()
    })

    const box = event.currentTarget
    const boxColor = box.dataset.color ?? null

    const Xpos = event.clientX
    const Ypos = event.clientY

    const links = []

    /**
     * This creates the menu container
     * @returns {HTMLDivElement}
     */
    const createMenu = () => {
        const menu= document.createElement('div')
        menu.classList.add('contextual-menu')
        menu.style.top  = `${Ypos}px`
        menu.style.left = `${Xpos}px`

        return menu
    }

    /**
     * This generates a link to add to menu
     * @param icon
     * @param innerText
     * @param callback
     * @returns {HTMLAnchorElement}
     */
    const generateLink = (icon, innerText, callback) => {
        const link = document.createElement('a')
        link.innerHTML = icon + innerText
        link.addEventListener('click', callback)
        links.push(link)
        return link
    }

    /**
     * This makes the menu visible
     */
    const open = () => {
        document.body.appendChild(menu)
        onOpen()
    }

    /**
     * What should happen on opening menu
     */
    const onOpen = () => {
        document.addEventListener('keyup', onEscape)
        document.addEventListener('click', onDocumentClick)
    }

    /**
     * Listen to keyboard 'espace' key
     * @param e
     */
    const onEscape = (e) => {
        if (e.code === 'Escape') {
            close()
        }
    }

    /**
     * Listen to click anywhere in the document except on menu's links
     * @param e
     */
    const onDocumentClick = (e) => {
        const clickedElement = e.currentTarget
        if(!links.includes(clickedElement)) {
            close()
        }
    }

    /**
     * Remove the menu from DOM
     */
    const close = () => {
        document.body.removeChild(menu)
        onClose()
    }

    /**
     * What should happen on closing menu
     */
    const onClose = () => {
        document.removeEventListener('keyup', onEscape)
        document.removeEventListener('click', onDocumentClick)
    }

    // ################################################### LINKS AND MENU ACTIONS

    /**
     * Creates the link to pick color and add it to menu
     */
    const createPipetteLink = () => {
        const link = generateLink(Icons.pipette(25, '#FFFFFF'), 'Pick color', () => {

            if(boxColor) {
                const ev = new CustomEvent('ColorHasBeenPicked', {
                    detail: { color: boxColor }
                })
                document.dispatchEvent(ev)
            }
            close()
        })

        menu.appendChild(link)
    }


    // #########################################################################

    /**
     * Launch menu
     */
    const menu = createMenu()
    createPipetteLink()
    open()

}
