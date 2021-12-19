// function tarea(done){ //Es una funcion (Callback) para decirle a GULP que ya termino, en la linea 3
//     console.log("desde la primer tarea");
//     done();
// }
// exports.tarea = tarea; //Esto lo que hace es poner la tarea disponible para poder ejecutarla desde la terminal con gulp

const {src, dest, watch, parallel} = require("gulp");

//Dependencias de CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

//Dependencias de Imagenes (Para convertir imagenes a webp)
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");
//ESTO SE HACE AL FINAL PARA MEJORAR EL CODIGO
const autoprefixer = require("autoprefixer"); //p/q funcione en el navegador que le digamos
const cssnano = require("cssnano"); //compime el codigo
const postcss = require("gulp-postcss");//hace algunas transformaciones por emdio de los otros dos
const sourcemaps = require("gulp-sourcemaps");
//MEJORAR EL CODIGO JS
const terser = require("gulp-terser-js");

function css( done ){
    //TAREAS:
    
    src("src/scss/**/*.scss")//identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe(plumber())    
        .pipe( sass() )//Compilarlo
        .pipe( postcss([autoprefixer(), cssnano()]) ) //Al final! Para identificar el codigo despues hay que usar sourceMap
        .pipe(sourcemaps.write('.'))
        .pipe( dest("build/css") ) //Almacenarlo en el disco duro. 
    done();
}

function versionWebp( done ){

    const opciones ={
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"))

    done();
}
function versionAvif( done ){

    const opciones ={
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"))

    done();
}

function imagenes(done){
    const opciones = { 
        optimizationLevel: 3
    }
    src("src/img/**/*.{png,jpg}")
    .pipe(cache(imagemin(opciones) ) )
    .pipe( dest("build/img") )

    done();
}

function javascript(done){
    src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/js"));

    done();
}

function dev ( done ){

    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.scss", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes, versionWebp, versionAvif, javascript, dev);
