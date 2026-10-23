// Los 8 puntos de la Marcha de Guambra (de Fuerte Tiuna a Villa de Cura).
// Las coordenadas coinciden con los extremos de cada tramo en data/ruta.geojson.
window.PUNTOS = [
  {
    id: 1,
    nombre: "Academia Militar · Fuerte Tiuna",
    lugar: "Caracas, Distrito Capital",
    etiqueta: "Punto de salida",
    fecha: "1810 · 2010",
    coords: [10.44813, -66.90499],
    resena: [
      "La marcha parte de la Academia Militar del Ejército, en el complejo de Fuerte Tiuna. La institución reclama como origen la Academia de Matemáticas creada en Caracas en 1810, en los primeros meses del proceso independentista.",
      "Fuerte Tiuna se construyó a mediados del siglo XX como la principal sede militar del país. Desde 2010 sus academias forman parte de la Universidad Militar Bolivariana de Venezuela (UMBV), cuyos cadetes recorren cada año la ruta en homenaje a Ezequiel Zamora."
    ],
    dato: "La columna de cadetes sale en formación, con apoyo de seguridad vial hasta el Peaje de Tazón."
  },
  {
    id: 2,
    nombre: "Peaje de Tazón",
    lugar: "Km 0 · Autopista Regional del Centro",
    etiqueta: "Kilómetro cero",
    fecha: "Km 0",
    coords: [10.40462, -66.94715],
    resena: [
      "El Peaje de Tazón marca el kilómetro cero de la Autopista Regional del Centro, la vía que une Caracas con los valles de Aragua y Carabobo. Aquí comienza oficialmente el conteo de la marcha.",
      "Durante la época colonial y el siglo XIX, este paso de montaña formaba parte de los caminos de recuas y carretas por donde salían de los valles centrales el cacao, el añil y la caña. Esos mismos caminos fueron recorridos por los ejércitos de la Independencia y, años después, por las tropas federales."
    ],
    dato: "Desde aquí la ruta asciende hacia la serranía del interior antes de bajar a los valles de Aragua."
  },
  {
    id: 3,
    nombre: "Las Tejerías",
    lugar: "Municipio Santos Michelena, Aragua",
    etiqueta: "Entrada a Aragua",
    fecha: "Siglo XVIII",
    coords: [10.253, -67.176],
    resena: [
      "Las Tejerías debe su nombre a los hornos donde se fabricaban tejas y ladrillos para las construcciones de la región. Es la puerta oriental de los Valles de Aragua, uno de los territorios agrícolas más ricos de la Venezuela colonial y republicana.",
      "En estos valles vivían los peones, jornaleros y esclavizados que trabajaban las haciendas. Fue entre ellos donde, en 1846, encontró eco el llamado de Zamora a la tierra y a la libertad."
    ],
    dato: "La marcha entra aquí al estado Aragua, escenario principal de la insurrección campesina de 1846."
  },
  {
    id: 4,
    nombre: "El Consejo",
    lugar: "Municipio José Rafael Revenga, Aragua",
    etiqueta: "Valle del río Aragua",
    fecha: "Haciendas coloniales",
    coords: [10.247, -67.24],
    resena: [
      "El Consejo es un pueblo de origen colonial asentado en el valle del río Aragua, rodeado durante siglos de haciendas de caña de azúcar, cacao y café.",
      "La concentración de la tierra en pocas manos y las duras condiciones de trabajo en estas haciendas son el trasfondo social de la rebelión de 1846: los campesinos reclamaban tierras propias, el fin de la esclavitud y elecciones populares."
    ],
    dato: "Las haciendas del valle fueron fuente de reclutas tanto para la Independencia como para la causa federal."
  },
  {
    id: 5,
    nombre: "La Victoria",
    lugar: "Municipio José Félix Ribas, Aragua",
    etiqueta: "Batalla de La Victoria",
    fecha: "12 de febrero de 1814",
    coords: [10.22768, -67.33274],
    resena: [
      "El 12 de febrero de 1814, el general José Félix Ribas defendió La Victoria frente a las fuerzas realistas comandadas por Francisco Tomás Morales. Buena parte de sus tropas eran jóvenes estudiantes y seminaristas de Caracas sin experiencia militar.",
      "Tras una jornada entera de combate, la llegada de refuerzos permitió a los patriotas ganar la batalla. En recuerdo de aquellos jóvenes, cada 12 de febrero se celebra en Venezuela el Día de la Juventud: un ejemplo cercano para los cadetes que marchan."
    ],
    dato: "Frase atribuida a Ribas: «No podemos optar entre vencer o morir: ¡necesario es vencer!»"
  },
  {
    id: 6,
    nombre: "San Mateo",
    lugar: "Municipio Bolívar, Aragua",
    etiqueta: "Hacienda de los Bolívar",
    fecha: "25 de marzo de 1814",
    coords: [10.2131, -67.4189],
    resena: [
      "San Mateo fue la hacienda de la familia Bolívar, donde el Libertador pasó parte de su infancia. En 1814 se convirtió en el cuartel de Simón Bolívar durante la campaña contra las fuerzas de José Tomás Boves.",
      "El 25 de marzo de 1814, el capitán neogranadino Antonio Ricaurte, al ver que el enemigo estaba por tomar el depósito de pólvora en la casa alta de la hacienda, lo hizo volar sacrificando su vida. Hoy el lugar es museo y uno de los símbolos de la gesta independentista."
    ],
    dato: "El Ingenio Bolívar y la Casa de Ricaurte forman el complejo museístico de San Mateo."
  },
  {
    id: 7,
    nombre: "Cagua",
    lugar: "Municipio Sucre, Aragua",
    etiqueta: "Camino al sur",
    fecha: "1846",
    coords: [10.1867, -67.4594],
    resena: [
      "Desde Cagua la ruta deja el eje de los valles y toma hacia el sur, rumbo a los llanos. En 1846 el país vivía una tensa campaña electoral: el Partido Liberal de Antonio Leocadio Guzmán agitaba los pueblos con la prensa de oposición contra el gobierno conservador.",
      "Ezequiel Zamora, nacido en Cúa (1817), era entonces comerciante en Villa de Cura y militante liberal. Cuando se le impidió participar en los comicios, decidió tomar las armas junto a los campesinos de la región."
    ],
    dato: "La insurrección de 1846 se extendió por Aragua, los Valles del Tuy, Carabobo y Guárico."
  },
  {
    id: 8,
    nombre: "Villa de Cura · Guambra",
    lugar: "Municipio Zamora, Aragua",
    etiqueta: "Meta · Alzamiento de Zamora",
    fecha: "Septiembre de 1846",
    coords: [10.03783, -67.48968],
    resena: [
      "En las inmediaciones de Villa de Cura, en el sitio de Guambra, Ezequiel Zamora se alzó en septiembre de 1846 al frente de un ejército de campesinos bajo las consignas «Tierras y hombres libres», «Elección popular» y «Horror a la oligarquía».",
      "Aunque la rebelión fue derrotada en 1847 y Zamora apresado, sus ideas resurgieron en la Guerra Federal (1859–1863), donde se convirtió en el General del Pueblo Soberano, venció en Santa Inés (10 de diciembre de 1859) y murió en San Carlos el 10 de enero de 1860. La Marcha de Guambra culmina aquí en su memoria."
    ],
    dato: "El municipio que tiene por capital a Villa de Cura lleva hoy el nombre de Zamora."
  }
];