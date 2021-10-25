function canvas(selector, options) {
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)

    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect();

    let isPaint = false // чи активно малювання
    let points = [] //масив з точками
// об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging,color,stroke) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging,
            color: color,
            stroke: stroke
        })
    }

// головна функція для малювання
    const redraw = () => {
        //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points) {
            context.beginPath();
            if (point.dragging && prevPoint) {
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.strokeStyle = point.color
            context.lineWidth = point.stroke
            context.stroke();
            prevPoint = point;
        }
    }

// функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY,false,document.querySelector('input[type="color"]').value,document.querySelector('input[type="range"]').value);
        redraw();
    }

    const mouseMove = event => {
        if (isPaint) {
            addPoint(event.pageX, event.pageY, true,document.querySelector('input[type="color"]').value,document.querySelector('input[type="range"]').value);
                redraw();
        }
    }

// додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup', () => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave', () => {
        isPaint = false;
    });
    // TOOLBAR
    const toolBar = document.getElementById('toolbar')
// clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.textContent = 'Clear'

    clearBtn.addEventListener('click', () => {

        context.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)

    const downloadBtn = document.createElement('button')
    downloadBtn.classList.add('btn')
    downloadBtn.textContent = 'Download'

    downloadBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank', 'image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', downloadBtn)

    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.textContent = 'Save'

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })
    toolBar.insertAdjacentElement('afterbegin', saveBtn)

    const restoreBtn = document.createElement('button')
    restoreBtn.classList.add('btn')
    restoreBtn.textContent = 'Restore'

    restoreBtn.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        if (localStorage.getItem('points') != null) {
            let load = localStorage.getItem('points');
            points = JSON.parse(load);
            localStorage.removeItem('points');
            redraw();
        }
    })
    toolBar.insertAdjacentElement('afterbegin', restoreBtn)

    const TimestampBtn = document.createElement('button')
    TimestampBtn.classList.add('btn')
    TimestampBtn.textContent = 'Timestamp'

    TimestampBtn.addEventListener('click', () => {
        context.fillText(new Date().toDateString(), canvas.width - 250, canvas.height - 20)
        context.fillText(new Date().toTimeString(), canvas.width - 250, canvas.height - 30)
    })
    toolBar.insertAdjacentElement('afterbegin', TimestampBtn)

    const colorPicker = document.createElement('input')
    colorPicker.setAttribute('type', 'color')
    colorPicker.setAttribute('value', options.strokeColor)

    colorPicker.addEventListener('change', (e) => {
        context.strokeStyle = colorPicker.value
    })
    toolBar.insertAdjacentElement('beforeend', colorPicker)

    const strokePicker = document.createElement('input')
    strokePicker.setAttribute('type', 'range')
    strokePicker.setAttribute('min',  options.strokeWidth)
    strokePicker.setAttribute('max',  options.strokeWidth + 25)
    strokePicker.setAttribute('value', options.strokeWidth)

    strokePicker.addEventListener('change', (e) => {
        context.strokeStyle = strokePicker.value
    })
    toolBar.insertAdjacentElement('afterend', strokePicker)
    
    const BackGroundBtn = document.createElement('button')
    BackGroundBtn.classList.add('btn')
    BackGroundBtn.textContent = 'BackGround'

    BackGroundBtn.addEventListener('click', () => {
        const img = new Image;
        img.src = `https://www.fillmurray.com/200/300)`;
        img.onload = () => {
            context.drawImage(img, 0, 0);
        }

    })
    toolBar.insertAdjacentElement('afterbegin', BackGroundBtn)

    const ToolBarBtn = document.createElement('button')
    ToolBarBtn.classList.add('btn')
    ToolBarBtn.textContent = 'ToolBar'

    ToolBarBtn.addEventListener('click', () => {
        ToolBarBtn.innerHTML = '<img src="assets/img/image2.jpg" height="30px" width="30px" />';

        TimestampBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

        saveBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

        clearBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

        downloadBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

        restoreBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

        BackGroundBtn.innerHTML = '<img src="assets/img/132.png" height="30px" width="30px" />';

    })
    toolBar.insertAdjacentElement('afterbegin', ToolBarBtn)

}