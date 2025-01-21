// resources/js/utils/imageOptimizer.js

export const optimizeImage = (file, maxWidth = 1200) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = event => {
            const img = new Image()
            img.src = event.target.result

            img.onload = () => {
                const elem = document.createElement('canvas')
                const scaleFactor = maxWidth / img.width

                elem.width = maxWidth
                elem.height = img.height * scaleFactor

                const ctx = elem.getContext('2d')
                ctx.drawImage(img, 0, 0, elem.width, elem.height)

                ctx.canvas.toBlob(
                    blob => {
                        resolve(new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        }))
                    },
                    file.type,
                    0.8
                )
            }
            img.onerror = reject
        }
        reader.onerror = reject
    })
}
