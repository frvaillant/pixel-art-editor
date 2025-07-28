import { Controller } from '@hotwired/stimulus';
import ColorChart from "../js/service/colorChart.js";
import html2canvas from "html2canvas";
import {Icons} from "../js/service/Icons.js";


export default class extends Controller {

    connect() {
        this.backgroundColor = '#FFFFFF'
        this.width = this.element.dataset.gridWidth

        /** The GPT form container */
        this.form = null

        /** The result picture from analyze */
        this.resultPicture = null

        /** The color choosen by user */
        this.activeColor = '#000000'

        /** All the grid boxes HTML Elements */
        this.boxes = []

        this.colorChart = new ColorChart()
        this.colorChart.draw(this.element)
        this.draw()

        /** If 'A' key is maintained pressed */
        this.keyPressed = false

        /** The colorChart choosen Color */
        document.addEventListener('ColorHasChanged', () => {
            this.activeColor = this.colorChart.getColor()
        })

        this.setupKeyboardListeners()

    }

    /**
     * Listening to keyboard.
     * While "A" is pressed, drawing mode is activated by hovering over the boxes.
     */
    setupKeyboardListeners = () => {
        const handler = (evt, isDown) => {
            if (this.drawingModeKeyIsPressed(evt)) {
                this.keyPressed = isDown;
            }
        }

        window.addEventListener('keydown', evt => handler(evt, true));
        window.addEventListener('keyup', evt => handler(evt, false));
    }

    drawingModeKeyIsPressed = (evt) => {
        return evt.key.toLowerCase() === 'a'
    }

    /**
     * Builds pixel art game html
     */
    draw = () => {

        this.createGrid()

        this.fillGrid()

        this.element.appendChild(this.grid)
        this.element.appendChild(this.createTools())
    }

    /**
     * Fills the grid with boxes
     */
    fillGrid = () => {
        for(let row = 0; row < this.width; row++) {
            for(let col = 0; col < this.width; col++) {
                this.grid.appendChild(this.createBox(row, col))
            }
        }
    }

    /**
     * Creates pixel-art grid
     */
    createGrid = () => {
        this.grid = document.createElement('div')
        this.grid.classList.add('grid', `grid-${this.width}`)
    }

    /**
     * Creates a box for pixel-art drawing
     *
     * @param row
     * @param col
     * @returns {HTMLDivElement}
     */
    createBox = (row, col) => {
        const box = document.createElement('div')
        box.classList.add('box')
        box.addEventListener('click', this.changeColor)
        box.addEventListener('mouseenter', (e) => {
            if(this.keyPressed) {
                this.changeColor(e)
            }
        })

        if (!this.boxes[row]) {
            this.boxes[row] = []
        }

        this.boxes[row][col] = box
        return box
    }

    /**
     * Change box color
     * @param e
     */
    changeColor = (e) => {
        const box = e.target
        box.dataset.color = this.activeColor
        box.style.background = this.activeColor
    }

    /**
     *
     * @returns {HTMLAnchorElement}
     */
    createResetButton = () => {
        const btn = document.createElement('a')
        btn.href = '#'
        btn.innerHTML = Icons.eraser()
        btn.addEventListener('click', this.reset)
        return btn
    }

    /**
     *
     * @returns {HTMLAnchorElement}
     */
    createSaveButton = () => {
        const btn = document.createElement('a')
        btn.href = '#'
        btn.innerHTML = Icons.save()
        btn.addEventListener('click', this.export)
        return btn
    }

    /**
     * Create forms to send request to chatGpt
     * @returns {HTMLFormElement}
     */
    createIaType = () => {

        const form = document.createElement('form')

        const input = document.createElement('input')
        input.type = 'text'

        const button = document.createElement('button')
        button.innerHTML = Icons.picture(30, '#ffffff')
        button.innerHTML += ' Suggérer'

        button.addEventListener('click', async (e) => {
            e.preventDefault()
            await this.askToChatGpt(button, input.value)
        })

        const icon = document.createElement('div')
        icon.innerHTML = Icons.grid(32)
        form.appendChild(icon)
        form.appendChild(input)
        form.appendChild(button)
        this.form = form

        return form

    }

    /**
     * Add tools side
     * @returns {HTMLDivElement}
     */
    createTools = () => {
        const toolsBox = document.createElement('div')
        toolsBox.classList.add('tools')

        const header = document.createElement('div')
        header.classList.add('header')

        header.appendChild(this.createResetButton())
        header.appendChild(this.createSaveButton())

        toolsBox.appendChild(header)
        toolsBox.appendChild(this.createIaType())
        return toolsBox
    }

    /**
     * Sends request to ask gpt to generate a picture
     *
     * @param button
     * @param value
     * @returns {Promise<void>}
     */
    askToChatGpt = async (button, value) => {

        this.resultPicture?.remove()

        button.innerHTML += Icons.loader(25, '#ffffff', 'rotate')

        const route = `/ai/${value}`
        const response = await fetch(route, {

        })

        if(response.status === 200) {
            const data = await response.json()
            const grid = data.grid
            const imageSrc = data.imageSrc
            this.applyGptColors(grid)
            this.addPicture(imageSrc)
        }

        button.innerHTML = Icons.picture(30, '#ffffff')
        button.innerHTML += ' Suggérer'
    }

    addPicture = (imageSrc) => {
        const picture = document.createElement('img')
        picture.src = imageSrc
        this.resultPicture = picture
        this.form.appendChild(picture)
    }

    /**
     * colorGrid comes from gpt suggestion
     * @param colorGrid
     */
    applyGptColors = (colorGrid) => {
        for (let row = 0; row < colorGrid.length; row++) {
            for (let col = 0; col < colorGrid[row].length; col++) {
                const color = colorGrid[row][col]
                const box = this.boxes[row][col]

                if (box) {
                    box.style.backgroundColor = color
                    box.setAttribute('data-color', color)
                }
            }
        }
    }

    /**
     * Set all boxes to white
     */
    reset = () => {
        for (let row of this.boxes) {
            for (let box of row) {
                box.style.background = this.backgroundColor
                box.removeAttribute('data-color')
            }
        }
    }

    /**
     * Generates a picture from grid and prompts for download
     */
    export = () => {

        html2canvas(this.grid).then(canvas => {
            this.saveAs(canvas.toDataURL(), 'my-artwork.png');
        });

    }

    /**
     * generates prompt for download picture
     * @param uri
     * @param filename
     */
    saveAs = (uri, filename) => {

        const link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } else {
            window.open(uri);
        }
    }
}
