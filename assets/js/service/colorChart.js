import {Icons} from "./Icons.js";

export default class ColorChart {

    constructor() {
        this.defaultColor = 'black'
        this.color = this.defaultColor
        this.container = null
        this.activeBox = null

        this.colors = [
            'indianred', 'lightcoral', 'salmon', 'darksalmon', 'lightsalmon',
            'crimson', 'red', 'firebrick', 'darkred', 'pink',
            'lightpink', 'hotpink', 'deeppink', 'mediumvioletred', 'palevioletred',

            'coral', 'tomato', 'orangered', 'darkorange', 'orange',
            'gold', 'chocolate', 'sandybrown', 'peru', 'darkgoldenrod',
            'goldenrod', 'rosybrown', 'saddlebrown', 'sienna', 'brown', 'maroon',

            'yellow', 'lightyellow', 'lemonchiffon', 'lightgoldenrodyellow',
            'papayawhip', 'moccasin', 'peachpuff', 'palegoldenrod', 'khaki', 'darkkhaki',

            'greenyellow', 'chartreuse', 'lawngreen', 'lime',
            'limegreen', 'lightgreen', 'palegreen', 'mediumspringgreen',
            'springgreen', 'mediumseagreen', 'seagreen', 'forestgreen',
            'green', 'darkgreen', 'yellowgreen', 'olivedrab', 'olive', 'darkolivegreen',

            'aqua', 'cyan', 'lightcyan', 'paleturquoise', 'aquamarine',
            'turquoise', 'mediumturquoise', 'darkturquoise', 'cadetblue',
            'steelblue', 'lightseagreen', 'darkcyan', 'teal',

            'powderblue', 'lightblue', 'lightskyblue', 'skyblue',
            'deepskyblue', 'dodgerblue', 'cornflowerblue', 'royalblue',
            'blue', 'mediumblue', 'darkblue', 'navy', 'midnightblue',

            'lavender', 'thistle', 'plum', 'violet', 'orchid',
            'fuchsia', 'magenta', 'mediumorchid', 'mediumpurple',
            'blueviolet', 'darkviolet', 'darkorchid', 'darkmagenta',
            'purple', 'rebeccapurple', 'indigo', 'slateblue', 'darkslateblue',

            'white', 'snow', 'honeydew', 'mintcream', 'azure',
            'aliceblue', 'ghostwhite', 'whitesmoke', 'seashell',
            'beige', 'oldlace', 'floralwhite', 'ivory', 'antiquewhite',
            'linen', 'lavenderblush', 'mistyrose',

            'gainsboro', 'lightgray', 'lightgrey', 'silver',
            'darkgray', 'darkgrey', 'gray', 'grey',
            'dimgray', 'dimgrey', 'lightslategray', 'lightslategrey',
            'slategray', 'slategrey', 'darkslategray', 'darkslategrey', 'black'
        ];
    }

    /**
     * build html and append it to pixel-art editor
     * @param parentElement
     */
    draw = (parentElement) => {
        this.createColorChartContainer()
        this.addIcon()
        for (const color of this.colors) {
            this.createColorElements(color)
        }

        parentElement.appendChild(this.container)
    }

    /**
     * Returns choosen color
     * @returns {*}
     */
    getColor = () => {
        return this.color
    }

    /**
     * Builds container
     */
    createColorChartContainer = () => {
        const container = document.createElement('div')
        container.classList.add('chart-container')
        this.container = container
    }

    /**
     * just an illustration before color chart
     */
    addIcon = () => {
        const iconContainer = document.createElement('div')
        iconContainer.classList.add('grid-cols-all')
        iconContainer.innerHTML = Icons.colorChart(50, '#000000')
        this.container.appendChild(iconContainer)
    }

    /**
     * Create color chart picker element
     * @param color
     */
    createColorElements = (color) => {
        const colorBox = document.createElement('div')
        colorBox.classList.add('color-box', color)
        colorBox.dataset.color = color
        colorBox.style.background = color
        if(color === this.defaultColor) {
            this.activeBox = colorBox
            colorBox.classList.add('active')
        }
        const event = new CustomEvent('ColorHasChanged')
        colorBox.addEventListener('click', () => {
            this.color = color
            this.activeBox.classList.remove('active')
            this.activeBox = colorBox
            colorBox.classList.add('active')
            document.dispatchEvent(event)
        })
        this.container?.appendChild(colorBox)
    }

}
