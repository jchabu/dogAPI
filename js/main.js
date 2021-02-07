/* eslint-disable no-undef */
/* eslint-disable no-console */

// Crear interfaz
// Petición con el metodo para la lista de razas Y SUBRAZAS ( NO HECHO)
// Botón que al hacer click coja el valor del select y lo lleve a otra funcion
// Funcion para buscar el perro por su raza, modificando la URL

const newDogBtn = document.getElementsByTagName('button')[0]
const dogImg = document.getElementsByTagName('img')[0]

const razasURL = 'https://dog.ceo/api/breeds/list/all'
let item = null

/**
 * Con el siguiente código podemos hacer que cada vez que se seleccione un radio distinto. Este borra el select y lo reescribe
 * consiguiendo los datos con el método que se selecciono.
 */

if (document.querySelector('input[name="seleccion"]')) {
  document.querySelectorAll('input[name="seleccion"]').forEach((elem) => {
    elem.addEventListener('change', function (event) {
      item = event.target.value
      rmvSelector()
      dogBtn(item)
    })
  })
}

/**
 * Función para remover los eventos del botón principal.
 */
function rmvDogBtn () {
  newDogBtn.removeEventListener('click', showDogXML)
  newDogBtn.removeEventListener('click', showDogJQuery)
  newDogBtn.removeEventListener('click', showDogFetch)
}

function rmvSelector () {
  const contenedor = document.getElementsByClassName('selector')[0]
  contenedor.removeChild(contenedor.lastChild)
}
/**
 * Función para asignar un evento concreto al botón único
 * @param {String} item // Se utiliza para saber que tipo de radio está seleccionado
 */
function dogBtn (item) {
  rmvDogBtn()
  if (item === 'DogFetch') {
    listDogFetch()
    newDogBtn.addEventListener('click', showDogFetch)
  } else if (item === 'DogJQuery') {
    listDogJQuery()
    newDogBtn.addEventListener('click', showDogJQuery)
  } else {
    listDogXML()
    newDogBtn.addEventListener('click', showDogXML)
  }
}
/**
 * Función para crear el selector con el objeto JSON que se ha recibido
 * @param {Array} lista // Parametro con el objeto JSON.
 */
function dogSelector (lista) {
  const contenedor = document.getElementsByClassName('selector')[0]
  contenedor.appendChild(createNode('select', '', ['dog-selector'], []))
  Object.keys(lista).forEach(raza => {
    contenedor.lastChild.appendChild(createNode('option', raza, [], [{ name: 'value', value: `${raza}` }]))
  })
}
/**
 * Función para imprimir la imagen según los parametros que le han llegado.
 * @param {Array} objectImg // Objeto JSON.
 * @param {Number} objectLength // Longitud del JSON de las imagenes.
 */
function printImage (objectImg, objectLength) {
  const num = randomNumber(objectLength)
  dogImg.src = objectImg[num]
}

// ======= PETICIONES ====//

/**
 * Función para hacer una petición XMLHttpRequest para conseguir la imagen de la raza deseada.
 */
function showDogXML () {
  const valor = document.getElementsByClassName('dog-selector')[0].value
  // eslint-disable-next-line no-undef
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://dog.ceo/api/breed/' + valor + '/images')
  xhr.responseType = 'json'
  xhr.send()

  xhr.onload = function () {
    try {
      const data = this.response
      printImage(data.message, data.message.length)
      console.log('Petición realizada con XMLHttpRequest')
    } catch (err) {
      console.error(err)
    }
  }
}

/**
 * Función para crear el selector con el tipo de petición XMLHttpRequest
 */
function listDogXML () {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', razasURL)
  xhr.responseType = 'json'
  xhr.send()

  xhr.onload = function () {
    try {
      const data = this.response
      dogSelector(data.message)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }
}

// JQuery

/**
 * Función para hacer una petición JQuery para conseguir la imagen de la raza deseada.
 */
function showDogJQuery () {
  const valor = document.getElementsByClassName('dog-selector')[0].value
  $.ajax({
    url: 'https://dog.ceo/api/breed/' + valor + '/images', // URL de la petición
    type: 'GET', // tipo de la petición: POST o GET
    dataType: 'json', // tipo de dato que se espera
    success: function (json) { // función a ejecutar si es satisfactoria
      printImage(json.message, json.message.length)
    },
    error: function (jqXHR, status, error) { // función error
      console.log('Disculpe, existió un problema')
    },
    // función a ejecutar sin importar si la petición falló o no
    complete: function (jqXHR, status) {
      console.log('Petición enviada con JQuery')
    }
  })
}

/**
 * Función para crear el selector con el tipo de petición JQuery
 */
function listDogJQuery () {
  // eslint-disable-next-line no-undef
  $.ajax({
    url: razasURL, // URL de la petición
    type: 'GET', // tipo de la petición: POST o GET
    dataType: 'json', // tipo de dato que se espera
    success: function (json) { // función a ejecutar si es satisfactoria
      dogSelector(json.message)
    },
    error: function (jqXHR, status, error) { // función error
      console.log('Disculpe, existió un problema')
    },
    // función a ejecutar sin importar si la petición falló o no
    complete: function (jqXHR, status) {

    }
  })
}

// Fetch

/**
 * Función para hacer una petición Fetch para conseguir la imagen de la raza deseada.
 */
function showDogFetch () {
  const valor = document.getElementsByClassName('dog-selector')[0].value
  // eslint-disable-next-line no-undef
  fetch('https://dog.ceo/api/breed/' + valor + '/images')
    .then(response => response.json())
    .then(data => printImage(data.message, data.message.length))
    .catch(error => console.log(error))
  console.log('Petición realizada con Fetch')
}

/**
 * Función para crear el selector con el tipo de petición Fetch
 */
function listDogFetch () {
  fetch(razasURL)
    .then(response => response.json())
    .then(data => dogSelector(data.message))
    .catch(error => console.log(error))
}

// FUNCIONES ADICIONALES

/**
 * Función para crear nodo y devolverlo
 * @param {String} name // Etiqueta del nodo.
 * @param {String} content // Si tiene contenido, se puede dejar vacío.
 * @param {Array} classes // Array de clases que contendra la etiqueta.
 * @param {Objec} attributes // Atributos introduciendo nombre(name) del atributo y valor(value) que es el contenido del atributo.
 */
function createNode (name, content, classes, attributes) {
  const node = document.createElement(name)

  if (content !== '') {
    const nodeContent = document.createTextNode(content)
    node.appendChild(nodeContent)
  }
  if (classes.length > 0) {
    classes.forEach(classElement => {
      node.classList.add(classElement)
    })
  }

  if (attributes.length > 0) {
    attributes.forEach(nodeAttribute => {
      node.setAttribute(nodeAttribute.name, nodeAttribute.value)
    })
  }
  return node
}

/**
 * Función para sacar un número aleatorio dentro con un parametro máximo
 * @param {Number} margin // Número máximo (no incluido en la elección).
 */
function randomNumber (margin) {
  const num = Math.floor(Math.random() * Number(margin))
  return num
}
