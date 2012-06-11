var toBitmapURL = (function ($fromCharCode, FF, MAX_LENGTH) {
	function fromCharCode(code) {
        for (var
            result = [],
            i = 0,
            length = code.length;
            i < length; i += MAX_LENGTH
        ) {
            result.push($fromCharCode.apply(null, code.slice(i, i + MAX_LENGTH)));
        }
        return result.join("");
    }
    
    function numberToInvertedBytes(number) {
        return [
            number & FF,
            (number >> 8) & FF,
            (number >> 16) & FF,
            (number >> 24) & FF
        ];
    }
    
    function swapAndInvertY(data, width, height) {
        /**
         * Bitmap pixels array is stored "pseudo inverted"
         * RGBA => BGRA (read as Alpha + RGB)
         * in few words this canvas pixels array
         * [
         *   0, 1,  2,  3,  4,  5,  6,  7,
         *   8, 9, 10, 11, 12, 13, 14, 15
         * ]
         * is stored as bitmap one like
         * [
         *   10, 9, 8, 11, 14, 13, 12, 15,
         *   2, 1, 0,  3,  6,  5,  4,  7
         * ]
         */
        for (var
            i, j, x0, x1, y0, y1,
            sizeX = 4 * width,
            sizeY = height - 1,
            result = [];
            height--;
        ) {
            y0 = (3 * width) * (sizeY - height);
            y1 = sizeX * height;
            for (i = 0; i < width; i++) {
                j = i * 4;
                x0 = y0 + (i * 3);
                x1 = y1 + j;
                result[x0] = data[x1 + 2];
                result[x0 + 1] = data[x1 + 1];
                result[x0 + 2] = data[x1];
                // result[x0 + 3] = data[x1 + 3];
            }
        }
        return result;
    }
    
    function toBitmapURL(canvas) {
        var
            width = canvas.width,
            height = canvas.height,
            header = [].concat(
                numberToInvertedBytes(width),
                numberToInvertedBytes(height),
                1, 0,
                24, 0,
                3, 0, 0, 0,
                numberToInvertedBytes(
                    width * height * 3
                ),
                19, 11, 0, 0,
                19, 11, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, FF, 0,
                0, FF, 0, 0,
                FF, 0, 0, 0,
                0, 0, 0, FF,
                32, 110, 105, 87
            ),
            data = swapAndInvertY(
                canvas.getContext("2d").getImageData(
                    0, 0, width, height
                ).data,
                width,
                height
            ),
            offset
        ;
        header = numberToInvertedBytes(header.length).concat(header);
        offset = 14 + header.length;
//		document.write(data);
        return "data:image/bmp;base64," + btoa(fromCharCode(
            [66, 77].concat(
                numberToInvertedBytes(offset + data.length),
                0, 0, 0, 0,
                numberToInvertedBytes(offset),
                header,
                data
            )
        ));
    }
	
    return toBitmapURL;
    
}(String.fromCharCode, 0xFF, 0x7FFF));
/*
 * Canvas2Image v0.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

var g_strData;

var Canvas2Image = (function() {

	// check if we have canvas support
	var bHasCanvas = false;
	var oCanvas = document.createElement("canvas");
	if (oCanvas.getContext("2d")) {
		bHasCanvas = true;
	}
	// no canvas, bail out.
	if (!bHasCanvas) {
		return {
			saveAsBMP : function(){},
			saveAsPNG : function(){},
			saveAsJPEG : function(){}
		}
	}

	var bHasImageData = !!(oCanvas.getContext("2d").getImageData);
	var bHasDataURL = !!(oCanvas.toDataURL);
	var bHasBase64 = !!(window.btoa);
	
	// sends the generated file to the client
	var saveFile = function(strData) {
		g_strData = strData;
	}
	// generates a <img> object containing the imagedata
	var makeImageObject = function(strSource) {
		var oImgElement = document.createElement("img");
		oImgElement.src = strSource;
		return oImgElement;
	}

	var scaleCanvas = function(oCanvas, iWidth, iHeight) {
		if (iWidth && iHeight) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
			return oSaveCanvas;
		}
		return oCanvas;
	}

	return {
		saveAsBMP : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}
			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strData = toBitmapURL(oScaledCanvas);
			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace("data:image/bmp;base64,", ""));
			}
			return true;
		}
	};

})();