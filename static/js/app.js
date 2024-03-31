// Esperar a que el contenido del DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {
    // Crear un mapa Leaflet y establecer la vista en una ubicación específica
    var map = L.map('map').setView([23.19848697446314, -106.42321693728888], 16);

    // Añadir una capa de azulejos para el mapa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir un marcador en una ubicación específica (Plazuela Machado) y mostrar un popup
    L.marker([23.19848697446314, -106.42321693728888]).addTo(map)
        .bindPopup('Cafetería en la Plazuela Machado')
        .openPopup();

    // Variable para controlar la ruta
    var routeControl;

    // Función para generar la ruta desde una ubicación inicial hasta un destino
    function generateRoute(startLocation) {
        // Hacer una solicitud a Nominatim para obtener las coordenadas del destino
        fetch(`https://nominatim.openstreetmap.org/search?q=${startLocation}&format=json`)
            .then(response => response.json())
            .then(data => {
                // Verificar si se encontraron coordenadas para la ubicación ingresada
                if (data && data.length > 0) {
                    // Obtener las coordenadas del destino
                    var destination = [data[0].lat, data[0].lon];

                    // Calcular la ruta más corta (en este caso, una ruta directa)
                    var shortestPath = [destination, [23.19848697446314, -106.42321693728888]];

                    // Eliminar la ruta anterior si existe
                    if (routeControl) {
                        map.removeControl(routeControl);
                    }

                    // Mostrar la nueva ruta en el mapa
                    routeControl = L.Routing.control({
                        waypoints: shortestPath,
                        routeWhileDragging: true,
                        language: 'es' // Establecer el idioma de las indicaciones en español
                    }).addTo(map);
                } else {
                    // Alerta si no se encontraron coordenadas para la ubicación ingresada
                    alert('No se encontraron coordenadas para la ubicación ingresada.');
                }
            })
            .catch(error => {
                // Manejar errores al obtener coordenadas
                console.error('Error al obtener coordenadas:', error);
            });
    }

    // Función para iniciar el reconocimiento de voz y procesar el comando
    function startVoiceRecognition(event) {
        event.preventDefault(); // Evitar que se envíe el formulario

        // Verificar si el reconocimiento de voz es compatible con el navegador
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window || 'mozSpeechRecognition' in window || 'msSpeechRecognition' in window) {
            // Crear un objeto de reconocimiento de voz
            var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
            recognition.lang = 'es'; // Establecer el idioma del reconocimiento de voz

            // Array de palabras clave para identificar ubicaciones
            var keywords = ['dorada', 'juarez', 'malecon', 'zona', 'upsin',  'universidad ups', 'alarcon', 'pradera','Los Mochis'];

            // Evento que se dispara cuando se reconoce un resultado
            recognition.onresult = function(event) {
                // Obtener el texto reconocido y convertirlo a minúsculas
                var result = event.results[0][0].transcript.toLowerCase();
                // Insertar el texto en el campo de entrada
                document.getElementById('startLocation').value = result;

                // Verificar si alguna palabra clave está presente en el texto reconocido
                var keywordFound = keywords.some(keyword => result.includes(keyword));
                if (keywordFound) {
                    // Generar la ruta predeterminada si se encuentra una palabra clave
                    generateRoute('Cafetería en la Plazuela Machado');
                } else {
                    // Llamar a la función para generar la ruta con la ubicación ingresada
                    generateRoute(result);
                }
            };

            // Evento que se dispara cuando el reconocimiento de voz ha terminado
            recognition.onend = function() {
                // Devolver el foco al input después de que termine el reconocimiento por voz
                document.getElementById('startLocation').focus();
            };

            // Iniciar el reconocimiento de voz
            recognition.start();
        } else {
            // Alerta si el reconocimiento de voz no está soportado en el navegador
            alert('El reconocimiento de voz no está soportado en este navegador.');
        }
    }

    // Función para obtener la ubicación del usuario y generar automáticamente una ruta
    function getAndGenerateRouteFromUserLocation() {
        // Verificar si el navegador es compatible con la geolocalización
        if (navigator.geolocation) {
            // Obtener la ubicación actual del usuario
            navigator.geolocation.getCurrentPosition(function(position) {
                // Obtener las coordenadas de la ubicación del usuario
                var userLocation = [position.coords.latitude, position.coords.longitude];
                var userLocationString = `${userLocation[0]},${userLocation[1]}`;
                // Generar la ruta desde la ubicación del usuario
                generateRoute(userLocationString);
            }, function(error) {
                // Manejar errores al obtener la ubicación del usuario
                alert('Error al obtener la ubicación del usuario.');
                console.error(error);
            });
        } else {
            // Alerta si la geolocalización no es compatible con el navegador
            alert('Geolocalización no es compatible con este navegador.');
        }
    }

    // Agregar evento al botón de búsqueda por texto
    document.getElementById('generateRouteBtn').addEventListener('click', function() {
        // Obtener la ubicación ingresada por el usuario y generar la ruta
        var startLocation = document.getElementById('startLocation').value;
        generateRoute(startLocation);
    });

    // Agregar evento al botón para iniciar el reconocimiento de voz
    document.getElementById('btnVoz').addEventListener('click', startVoiceRecognition);

    // Generar automáticamente una ruta desde la ubicación del usuario al cargar la página
    getAndGenerateRouteFromUserLocation();
});
