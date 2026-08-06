---
title: "Qué es OPSEC: origen, doctrina y por qué las cinco fases no son toda la historia"
description: "OPSEC más allá del ciclo NSDD-298: origen en Vietnam (Purple Dragon), doctrina JP 3-13.3, diferencia con la seguridad clásica y casos reales de fallo operacional."
modulo_num: 1
tema_num: "1.1"
tema_titulo: "¿Qué es OPSEC?"
tema_desc: "OPSEC no es una lista de cinco pasos que se marca y se olvida. Es un proceso de inteligencia aplicada sobre uno mismo, nacido en Vietnam y formalizado como política de EE.UU. en 1988, cuya lógica cambia según quién sea 'el adversario': un ejército enemigo, el Blue Team de un cliente, o un investigador forense."
weight: 101
accent: "#FF4D6A"
accent_dim: "rgba(255, 77, 106, 0.08)"
accent_glow: "rgba(255, 77, 106, 0.25)"
subtemas:
  - anchor: "tema-1.1.1"
    label: "1.1.1 Más allá de las cinco fases clásicas"
  - anchor: "tema-1.1.1-origen"
    label: "Origen del concepto"
    sub: true
  - anchor: "tema-1.1.1-definiciones"
    label: "Definiciones formales vs. prácticas"
    sub: true
  - anchor: "tema-1.1.1-simplificacion"
    label: "Por qué el checklist de 5 fases se queda corto"
    sub: true
  - anchor: "tema-1.1.1-diferencia"
    label: "OPSEC vs. buenas prácticas de seguridad"
    sub: true
  - anchor: "tema-1.1.1-casos"
    label: "Casos reales de fallo de OPSEC"
    sub: true
  - anchor: "tema-1.1.2"
    label: "1.1.2 Las 5 fases clásicas de OPSEC"
  - anchor: "tema-1.1.2-fase1"
    label: "Fase 1: identificación de información crítica"
    sub: true
  - anchor: "tema-1.1.2-fase2"
    label: "Fase 2: análisis de amenazas"
    sub: true
  - anchor: "tema-1.1.2-fase3"
    label: "Fase 3: análisis de vulnerabilidades"
    sub: true
  - anchor: "tema-1.1.2-fase4"
    label: "Fase 4: evaluación de riesgos"
    sub: true
  - anchor: "tema-1.1.2-fase5"
    label: "Fase 5: aplicación de contramedidas"
    sub: true
  - anchor: "tema-1.1.2-ciclo"
    label: "Cómo se retroalimentan las fases"
    sub: true
  - anchor: "tema-1.1.2-errores"
    label: "Errores comunes por fase"
    sub: true
  - anchor: "tema-1.1.3"
    label: "1.1.3 Diferencias entre OPSEC, INFOSEC, COMSEC y PERSEC"
  - anchor: "tema-1.1.3-definiciones"
    label: "Definición precisa de cada término"
    sub: true
  - anchor: "tema-1.1.3-que-protege"
    label: "Qué protege cada uno y dónde se solapan"
    sub: true
  - anchor: "tema-1.1.3-ejemplos"
    label: "Fallos por disciplina en un mismo engagement"
    sub: true
  - anchor: "tema-1.1.3-confusion"
    label: "Por qué se confunden estos términos"
    sub: true
  - anchor: "tema-1.1.3-relacionados"
    label: "Términos relacionados: TRANSEC, EMSEC, SIGSEC, TECHSEC"
    sub: true
  - anchor: "tema-1.1.4"
    label: "1.1.4 Por qué OPSEC no es anonimato"
  - anchor: "tema-1.1.4-concepto"
    label: "Anonimato vs. OPSEC (y privacidad)"
    sub: true
  - anchor: "tema-1.1.4-capas"
    label: "El modelo de capas de protección"
    sub: true
  - anchor: "tema-1.1.4-casos"
    label: "Casos documentados por capa"
    sub: true
  - anchor: "tema-1.1.4-proceso"
    label: "Estado puntual vs. proceso continuo"
    sub: true
  - anchor: "tema-1.1.4-aplicacion"
    label: "Aplicación de las capas: red team vs. personal"
    sub: true
  - anchor: "tema-1.1.5"
    label: "1.1.5 OPSEC ofensivo vs defensivo: el atacante también deja huella"
  - anchor: "tema-1.1.5-conceptos"
    label: "OPSEC ofensivo vs. OPSEC defensivo"
    sub: true
  - anchor: "tema-1.1.5-huella"
    label: "Qué huella deja el operador aunque la técnica sea correcta"
    sub: true
  - anchor: "tema-1.1.5-infraestructura"
    label: "Infraestructura de operación: redirectores y compartimentación"
    sub: true
  - anchor: "tema-1.1.5-deteccion"
    label: "Cómo detecta el Blue Team esos fallos"
    sub: true
  - anchor: "tema-1.1.5-frameworks"
    label: "Frameworks: MITRE ATT&CK, TIBER-EU y Rules of Engagement"
    sub: true
  - anchor: "tema-1.1.5-por-que-importa"
    label: "Por qué importa en un engagement autorizado"
    sub: true
  - anchor: "tema-1.1.6"
    label: "1.1.6 OPSEC by design: desde el primer minuto, no como parche"
  - anchor: "tema-1.1.6-concepto"
    label: "Qué significa \"OPSEC by design\""
    sub: true
  - anchor: "tema-1.1.6-porque-falla-parche"
    label: "Por qué remediar a posteriori casi nunca funciona"
    sub: true
  - anchor: "tema-1.1.6-compartimentacion"
    label: "Compartimentación como principio central"
    sub: true
  - anchor: "tema-1.1.6-decisiones"
    label: "Decisiones desde el minuto cero"
    sub: true
  - anchor: "tema-1.1.6-errores-parche"
    label: "Errores típicos al \"arreglar\" OPSEC después de un fallo"
    sub: true
  - anchor: "tema-1.1.6-aplicacion"
    label: "Aplicación práctica: red team vs. OPSEC personal"
    sub: true
  - anchor: "tema-1.1.6-fuentes"
    label: "Fuentes de todo el tema 1.1"
    sub: true
---

<section class="tema-section" id="tema-1.1.1">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.1</span> Más allá de las cinco fases clásicas
</h2>
<div class="tema-content">

<p>Casi cualquier curso o web de ciberseguridad resume OPSEC en cinco pasos: identificar información crítica, analizar amenazas, analizar vulnerabilidades, evaluar riesgos y aplicar contramedidas. Esa lista es correcta, es literalmente el proceso oficial descrito en la directiva presidencial NSDD-298 de 1988, pero tratarla como <em>toda</em> la doctrina convierte OPSEC en un checklist estático de una sola pasada. La doctrina militar de origen dice otra cosa: OPSEC es un proceso continuo, iterativo y retroalimentado, no una lista de tareas que se marca y se archiva.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea:</strong> la frase clave de la doctrina militar (Joint Publication 3-13.3, Departamento de Defensa de EE.UU.) es literal: <em>"OPSEC is an operations function, not a security function"</em> — OPSEC es una función operativa, no una función de seguridad. Esa distinción es el hilo conductor de todo este artículo.</div>
</div>

<h3 id="tema-1.1.1-origen">Origen del concepto</h3>

<p>Se suele citar como antecedente remoto una carta de George Washington al coronel <strong>Elias Dayton</strong>, fechada el 26 de julio de 1777, sobre la importancia del secreto en las operaciones. Es un antecedente conceptual real, aparece citado en la propia historia oficial de la NSA sobre el programa OPSEC, pero es más folclore doctrinal que el origen del programa como tal.</p>

<p>El origen operativo real está en la guerra de Vietnam. El 7 de febrero de 1965, un pelotón del Viet Cong atacó la base aérea estadounidense de Pleiku, a unos 320 km al norte de Saigón, destruyendo un avión de transporte y nueve helicópteros, y dañando otros quince aviones. Entre enero y septiembre de 1966, la campaña de bombardeo Rolling Thunder perdió 228 aviones de combate y apoyo de ala fija, lo que generó preocupación al más alto nivel del mando estadounidense: el enemigo estaba anticipando los ataques con una precisión que no cuadraba con ningún fallo de cifrado conocido.</p>

<p>Para investigar esto se formó un equipo de análisis de operaciones que operó bajo el nombre en clave <strong>"Purple Dragon"</strong>. El nombre de la disciplina resultante, "Operations Security", y el nombre en clave del equipo, "Purple Dragon", son dos cosas distintas que conviene no mezclar: el término "security" se eligió deliberadamente para diferenciar el trabajo de otros grupos de "operations analysis" y por motivos de conformidad con la NSA, mientras que "Purple Dragon" fue simplemente el nombre en clave elegido de una lista disponible para un equipo pensado en origen como temporal.</p>

<p>El hallazgo que confirmó la hipótesis de fondo llegó el 25 de diciembre de 1969: una unidad de la 1ª División de Infantería, en un barrido por la provincia de Binh Duong cerca de Saigón, se topó con una unidad de inteligencia de comunicaciones (COMINT) del ejército norvietnamita. Capturaron a doce de sus dieciocho integrantes junto con unos 2.000 documentos y el equipo de intercepción, el mayor hallazgo COMINT de toda la guerra. Confirmaba que el enemigo no dependía solo de criptoanálisis: explotaba masivamente señales e indicadores no clasificados, es decir, el patrón de comportamiento propio, no el contenido cifrado.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Contradicción entre fuentes:</strong> sobre quién impulsó institucionalmente el equipo Purple Dragon hay versiones distintas: una fuente lo atribuye a una decisión del almirante Ulysses S. Grant Sharp (CINCPAC) en 1966; otra lo describe como una iniciativa puntual del Estado Mayor Conjunto (JCS).</div>
</div>

<p>Tras el éxito de Purple Dragon mejorando la efectividad de combate de las unidades auditadas, se impulsaron programas de seguridad de operaciones basados en ese modelo, que se volvieron obligatorios para todos los mandos de EE.UU. en el mundo y que después se extendieron a agencias fuera del Departamento de Defensa. En 1983, el Departamento de Energía (DOE) participaba en el Senior Interagency Group for Intelligence (SIG-I), que propuso una política nacional de OPSEC y un Comité Asesor Nacional de OPSEC (NOAC). Esa propuesta cristalizó el <strong>22 de enero de 1988</strong>, cuando el presidente Ronald Reagan firmó la <strong>Directiva de Decisión de Seguridad Nacional 298 (NSDD-298)</strong>, que estableció la política nacional de OPSEC, fijó el proceso de cinco pasos y creó el Interagency OPSEC Support Staff (IOSS).</p>

<p>El propio documento desclasificado de la NSA de 1993, <em>"Purple Dragon: The Origin and Development of the United States OPSEC Program"</em>, es la fuente histórica primaria más citada sobre este origen, y ya planteaba explícitamente que las lecciones de Purple Dragon no eran solo para lo militar, sino aplicables también al profesional civil de criptología. La adopción en el mundo corporativo y de ciberseguridad (hacktivismo, cibercrimen, red teaming) fue un proceso gradual desde los años 90-2000, sin una fecha oficial equivalente a la NSDD-298.</p>

<h3 id="tema-1.1.1-definiciones">Definiciones formales vs. prácticas</h3>

<p>Conviene distinguir tres niveles de definición, porque en cada uno el término "adversario" significa algo distinto.</p>

<p><strong>Nivel de política presidencial (NSDD-298, 1988):</strong> OPSEC es un proceso sistemático mediante el cual el Gobierno de EE.UU. y sus contratistas pueden negar a potenciales adversarios información sobre capacidades e intenciones, identificando, controlando y protegiendo evidencia generalmente no clasificada de la planificación y ejecución de actividades sensibles. Un matiz doctrinal importante: OPSEC complementa, no sustituye, la seguridad física, de la información, de personal, de computadoras, de señales y de comunicaciones. No es "una medida de seguridad más": es una capa analítica distinta.</p>

<p><strong>Nivel de doctrina militar actual (Joint Publication 3-13.3, DoD):</strong> OPSEC es una capacidad que identifica y controla información crítica, indicadores de las acciones propias inherentes a operaciones militares, e incorpora contramedidas para reducir el riesgo de que un adversario explote vulnerabilidades. Los "indicadores OPSEC" son acciones detectables por las fuerzas propias e información de fuentes abiertas que un adversario puede interpretar o correlacionar para derivar información crítica. El núcleo conceptual es la <strong>agregación</strong>: datos individuales triviales y no clasificados, al correlacionarse entre sí, pueden revelar un patrón sensible. La doctrina del Ejército (ATP 3-13.3, 2019) es explícita en que los programas de seguridad convencionales se centran en información clasificada, mientras que OPSEC se centra en proteger información <strong>no clasificada</strong>, incluyendo los llamados "elementos esenciales de información propia" (EEFI).</p>

<p><strong>Nivel aplicado a red teaming / pentesting:</strong> la definición que circula en el ámbito ofensivo (identificar información crítica para determinar si las acciones propias pueden ser observadas por la "inteligencia enemiga", en este caso el equipo defensor, y ejecutar medidas que reduzcan esa exposición) no es una definición distinta inventada para el sector: es la misma definición militar de JP 3-13.3, reutilizada tal cual en un contexto distinto.</p>

<div class="table-wrapper">
<table>
<thead><tr><th>Contexto</th><th>Quién es "el adversario"</th><th>Naturaleza de la relación</th></tr></thead>
<tbody>
<tr><td>Doctrina militar / gubernamental original</td><td>Entidad hostil externa a la misión nacional</td><td>Puramente adversarial</td></tr>
<tr><td>Red Team / pentesting</td><td>El Blue Team de la propia organización cliente</td><td>Adversarial en el ejercicio, colaborativa en el objetivo final (mejorar la seguridad del cliente)</td></tr>
<tr><td>Cibercrimen / dark web</td><td>Fuerzas del orden, investigadores forenses (FBI y equivalentes)</td><td>Adversarial, con capacidades de recolección distintas: orden judicial, correlación de metadatos, HUMINT online, frente al SIGINT/HUMINT militar original</td></tr>
</tbody>
</table>
</div>

<p>Esta tabla no es un detalle menor: es la razón por la que "traducir" OPSEC de un manual militar a un contexto de pentesting sin adaptar el marco de amenaza lleva a errores de enfoque.</p>

<h3 id="tema-1.1.1-simplificacion">Por qué el checklist de 5 fases se queda corto</h3>

<p>El ciclo NSDD-298 (identificación → amenazas → vulnerabilidades → riesgo → contramedidas) es la paráfrasis estándar que repite casi toda fuente corporativa y educativa, y no es incorrecta. El problema es tratarla como si fuera el total de la disciplina, convirtiendo OPSEC en un checklist de un solo ciclo, ejecutado una vez al inicio de la operación.</p>

<p>La propia JP 3-13.3 describe medidas de efectividad (MOE) y medidas de desempeño (MOP): la reacción del adversario se monitorea para determinar si las contramedidas están funcionando, y esa reacción retroalimenta el proceso. Hay incluso un efecto contraintuitivo: si una contramedida OPSEC es identificada por el adversario, ese mismo hecho puede alertarlo de que una operación es inminente. El acto de "proteger" se convierte en un indicador nuevo, un bucle recursivo que una lista lineal de cinco casillas no representa.</p>

<p>Otro elemento que el checklist no transmite bien es evitar <strong>patrones de comportamiento</strong>, no solo proteger datos puntuales. La doctrina insiste en evitar cambios drásticos al implementar contramedidas, porque un cambio repentino de procedimientos es en sí mismo un indicador de que algo distinto está ocurriendo. Es pensamiento de proceso continuo, no una tarea que se ejecuta y se cierra.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea:</strong> resumir OPSEC en cinco pasos técnicos tiende a tratarlo como un anexo más del checklist de cumplimiento. Lo que se pierde es su naturaleza real: inteligencia aplicada sobre uno mismo, integrada en cómo se planifica y ejecuta la actividad, no un control que se revisa al final.</div>
</div>

<p>Para un red team, esto tiene una consecuencia práctica directa: OPSEC no es una fase inicial del compromiso, es la base de su credibilidad durante toda la operación. Cada fase debe estar aislada, probada y registrada, y cada herramienta debe verificarse en cuanto a metadatos limpios y comportamiento realista, de forma continua.</p>

<h3 id="tema-1.1.1-diferencia">OPSEC vs. buenas prácticas de seguridad</h3>

<p>La cita de JP 3-13.3, <em>"OPSEC is an operations function, not a security function"</em>, es la clave de esta distinción. Las buenas prácticas de seguridad protegen sistemas y datos mediante controles: cifrado, parches, contraseñas, firewalls. OPSEC obliga a pensar desde la perspectiva de un observador externo: qué se puede inferir de la suma de comportamientos a lo largo del tiempo, incluso cuando cada acción individual parece inocua o no clasificada. El foco no es "¿qué vulnerabilidad técnica tengo?", sino "¿qué puede deducir de mí un adversario que me observa con paciencia?". Es un problema de agregación y correlación, no de un fallo puntual.</p>

<p>El caso de Ross Ulbricht (Silk Road) ilustra bien el contraste porque combina ambos tipos de fallo en un mismo expediente: una mala configuración de la página de login de Silk Road filtró la IP real de los servidores, eso es un fallo técnico clásico de seguridad. Pero reutilizar el alias "altoid" en un foro público y usarlo después para pedir ayuda relacionada con Silk Road es un fallo puramente de <strong>proceso de pensamiento OPSEC</strong>: no separar identidades, no anticipar la correlación.</p>

<p>Esa cascada se puede leer como un fallo en cadena sobre los propios cinco pasos: si un operador no identifica un dato como crítico (Principio 1) (en este caso, su correo personal y su alias), tampoco lo percibirá como una vulnerabilidad al exponerlo en un foro público (Principio 3); esa percepción errónea lleva a evaluar el riesgo de esa publicación como insignificante (Principio 4); y en consecuencia, no ve ninguna contramedida necesaria (Principio 5). Es la mejor ilustración disponible de "pensar como el adversario" frente a "aplicar un checklist de seguridad".</p>

<div class="callout callout-danger">
<span class="callout-icon">🚨</span>
<div class="callout-body"><strong>Peligro:</strong> la tecnología protege los datos; OPSEC protege a las personas. Se puede usar Tor Browser correctamente, cifrar cada mensaje con PGP y pagar exclusivamente en Monero, y aun así ser identificado si el proceso de pensamiento OPSEC, compartimentación de identidades, gestión de patrones de comportamiento, es débil.</div>
</div>

<h3 id="tema-1.1.1-casos">Casos reales de fallo de OPSEC</h3>

<p>Los siguientes casos son fallos de <strong>proceso</strong>, no fallos criptográficos ni "hackeos" en el sentido técnico, salvo donde se indica lo contrario.</p>

<p><strong>Ross Ulbricht / Silk Road ("Dread Pirate Roberts").</strong> Usó el alias "altoid" en varios foros para anunciar que Silk Road estaba activo a principios de 2011, y volvió a usar el mismo alias para contratar desarrolladores de una supuesta "startup de bitcoin", pidiendo currículums a una dirección de correo personal identificable. A principios de 2012, un usuario de StackOverflow con el nombre "Ross Ulbricht" preguntó cómo conectar a un servicio oculto de Tor usando PHP — la misma técnica que usaba el sitio de Silk Road — y cambió el nombre de usuario en menos de un minuto, pero el nombre original quedó registrado en los servidores de StackOverflow. Cambió después a "frosty" y al correo frosty@frosty.com; el análisis forense del servidor incautado en Islandia encontró una clave pública SSH con el comentario <code>frosty@frosty</code> en el archivo de claves autorizadas del servidor de administración de Silk Road, creando un vínculo trazable entre esa identidad y la administración del sitio. Una publicación suya en LinkedIn a principios de 2012 sobre una visión anarquista de simulación económica no era sospechosa por sí sola, pero cobró sentido en retrospectiva una vez que los investigadores ya lo tenían en su lista — el rastro funciona en ambas direcciones, de la acción al incidente y del incidente de vuelta a acciones pasadas aparentemente inocuas. Este caso combina, en un mismo expediente, un fallo técnico clásico (fuga de IP por mala configuración del login) con varios fallos de proceso OPSEC (reutilización de alias, correo personal, patrón de comportamiento en redes profesionales).</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Actualización:</strong> Ross Ulbricht fue indultado por Donald Trump el 21 de enero de 2025 y ya no cumple la cadena perpetua a la que fue condenado.</div>
</div>

<p><strong>Hector Monsegur "Sabu" (LulzSec).</strong> Sobre el mecanismo exacto de su identificación existen dos versiones que no coinciden, y no debe presentarse como un hecho cerrado. La versión más difundida (recogida por Fox News y The Register) sostiene que Sabu siempre ocultó su IP mediante proxies, pero en una ocasión inició sesión en una sala de IRC sin enmascararla, y con eso bastó para que el FBI lo ubicara. El propio Monsegur afirmó posteriormente una versión distinta: que siempre se conectaba a través de máquinas comprometidas y que nunca filtró su IP doméstica en IRC, y que el FBI lo desenmascaró a partir de datos personales suyos filtrados años antes en un "doxeo" en la red IRC Efnet, que los investigadores finalmente obtuvieron. No hay consenso sobre cuál versión es la correcta. Ambas, en cualquier caso, apuntan a fallos de compartimentación de identidad, no a un fallo criptográfico de las herramientas usadas.</p>

<p><strong>Jeremy Hammond (LulzSec).</strong> Habló con Sabu por IRC y reveló indicaciones de que había cumplido condena en una prisión federal en el pasado. Ese dato, combinado con otra información sobre los grupos involucrados, ayudó a acotar el número de sospechosos posibles y facilitó que el FBI obtuviera una orden judicial para monitorear su acceso a internet. Hammond sí usaba Tor, y Tor no fue el punto de fuga, ni siquiera fue necesario vulnerarlo. Es un caso claro de perfilado por fallo conversacional/social, no técnico.</p>

<p><strong>Alexandre Cazes (AlphaBay).</strong> El correo de bienvenida y de recuperación de contraseña de la plataforma llevaba en el encabezado la dirección personal pimp_alex_91@hotmail.com. Los investigadores rastrearon ese correo hasta su identidad real, vinculándolo con la administración del servidor. Es un caso mixto: descuido de proceso (usar una dirección de correo personal para algo operacional) combinado con una fuga técnica (esa dirección quedaba expuesta en el encabezado de los correos automáticos del sistema).</p>

<div class="table-wrapper">
<table>
<thead><tr><th>Caso</th><th>Vector de identificación</th><th>Tipo de fallo</th></tr></thead>
<tbody>
<tr><td>Ross Ulbricht</td><td>Reutilización de alias + correo personal + IP filtrada por mala configuración</td><td>Proceso OPSEC + técnico</td></tr>
<tr><td>Hector Monsegur "Sabu"</td><td>Contradictorio: login IRC sin proxy (v1) / doxeo antiguo reaprovechado (v2)</td><td>Proceso OPSEC (ambas versiones)</td></tr>
<tr><td>Jeremy Hammond</td><td>Revelación conversacional de datos biográficos por IRC</td><td>Proceso OPSEC (Tor no fue el vector)</td></tr>
<tr><td>Alexandre Cazes</td><td>Correo personal expuesto en encabezado de correos automáticos del sistema</td><td>Proceso OPSEC + técnico</td></tr>
</tbody>
</table>
</div>

<p>El patrón que se repite en todos estos casos es el mismo: el éxito genera complacencia, y la complacencia lleva al desliz. Con frecuencia se trata de individuos técnicamente competentes que, tras un exceso de confianza, cometen un error de más, del tipo que termina llevando a la policía hasta su puerta. Incluso Ross Ulbricht, consciente del riesgo, no pudo resistirse a insinuar su implicación en Silk Road en LinkedIn.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea:</strong> ninguno de estos cuatro casos cayó por un fallo criptográfico de las herramientas de anonimato que usaban. Cayeron por fallos de compartimentación, de gestión de patrones de comportamiento o de identidad, exactamente el terreno que la doctrina original de OPSEC pretende cubrir y que un checklist técnico de seguridad no contempla.</div>
</div>

</div>
</section>

<section class="tema-section" id="tema-1.1.2">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.2</span> Las 5 fases clásicas de OPSEC
</h2>
<div class="tema-content">

<p>El ciclo de cinco pasos clásico es real y está bien contrastado: el glosario del NIST (CSRC), citando la CNSSI 4009-2015 (derivada a su vez de la DoDD 5205.02E), reproduce el mismo proceso que la NSDD-298: identificación de información crítica, análisis de amenazas, análisis de vulnerabilidades, evaluación de riesgos y aplicación de contramedidas apropiadas. Lo que sigue no es una reformulación de esa lista, sino qué significa cada fase en la práctica, dónde se suele confundir con conceptos vecinos y cómo se conectan entre sí, porque el problema nunca ha sido la lista, sino tratarla como una secuencia de casillas independientes.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado — no es un marco NIST:</strong> el NIST Cybersecurity Framework (Identify / Protect / Detect / Respond / Recover) no es una adaptación oficial de NIST al proceso OPSEC. NIST no tiene un marco propio de "OPSEC de 5 fases": en su glosario solo referencia la definición militar vía CNSSI/DoDD. Cualquier mapeo entre ambos esquemas que se vea en blogs es una analogía de terceros, no una equivalencia formalizada por NIST.</div>
</div>

<h3 id="tema-1.1.2-fase1">Fase 1: identificación de información crítica</h3>

<p>Esta fase consiste en examinar la totalidad de una actividad para determinar qué evidencia explotable pero no clasificada podría ser adquirida a la luz de las capacidades de recolección conocidas de adversarios potenciales. Es el filtro que evita "proteger todo por igual", algo que diluiría los recursos disponibles.</p>

<p>En doctrina militar, este ejercicio se formaliza mediante las <strong>EEFI</strong> (Essential Elements of Friendly Information, elementos esenciales de información propia): los planificadores deben establecer qué preguntas haría probablemente el adversario sobre las intenciones, capacidades y actividades propias, porque las respuestas a esas preguntas pueden conducir a información crítica.</p>

<ul class="concept-list">
<li><strong>Pregunta clave 1:</strong> ¿qué preguntas haría el adversario sobre mis intenciones, capacidades y actividades?</li>
<li><strong>Pregunta clave 2:</strong> ¿qué pasaría si esto se hiciera público o cayera en manos equivocadas?</li>
<li><strong>Pregunta clave 3:</strong> ¿esta información, combinada con otra aparentemente trivial, revela algo sensible? (agregación)</li>
</ul>

<p>En un red team, la información crítica no son "los datos del cliente" en abstracto, sino aquello que podría exponer los planes del propio equipo ofensivo al Blue Team y permitirle tomar medidas preventivas: los programas, sistemas operativos e identificadores de máquinas virtuales usados quedan registrados en logs y pueden correlacionarse. Los datos almacenados en la infraestructura del Red Team, vulnerabilidades encontradas, exploits, datos exfiltrados del cliente durante el ejercicio, son igual de críticos de proteger.</p>

<p>En OPSEC personal no existe un catálogo formal de EEFI: cada individuo debe inferir qué cuenta como crítico, y es precisamente ahí donde más se falla. Para un diseñador freelance eso podría ser borradores de clientes y facturas; para un hospital, historiales de pacientes e inventario de medicamentos; para un particular, metadatos de redes sociales. Pistas pequeñas que parecen inofensivas pueden ser reveladoras: el perfil de una ciudad en una foto que señala el piso exacto de una oficina, una respuesta automática de "fuera de la oficina" que delata fechas de viaje, un anuncio de empleo que insinúa el lanzamiento próximo de un producto.</p>

<h3 id="tema-1.1.2-fase2">Fase 2: análisis de amenazas</h3>

<p>El objetivo de esta fase es identificar quién podría querer la información crítica definida en la Fase 1 y qué capacidad e intención tiene para obtenerla. La definición doctrinal de "amenaza" en OPSEC es una fórmula concreta: <strong>amenaza = intención + capacidad</strong>. Es una definición distinta de "vulnerabilidad" (Fase 3), y confundir ambas es uno de los errores más frecuentes en el material divulgativo sobre el tema.</p>

<ul class="concept-list">
<li><strong>Pregunta clave 1:</strong> ¿quiénes son mis adversarios?</li>
<li><strong>Pregunta clave 2:</strong> ¿qué capacidad de recolección tienen (técnica, humana, de fuentes abiertas)?</li>
<li><strong>Pregunta clave 3:</strong> ¿qué ganarían si obtuvieran esta información?</li>
</ul>

<p>En un ejercicio de red team, el Blue Team se considera un adversario porque el equipo ofensivo está atacando los sistemas que ellos han sido contratados para monitorear y defender, aunque el red team actúe con autorización y dentro de un alcance legal definido, eso no cambia el hecho de que se está actuando contra sus objetivos e intentando eludir sus controles. Un segundo adversario posible es un grupo de atacantes reales ajeno al ejercicio. El análisis de amenazas en un pentest exige modelar la capacidad defensiva real del cliente (madurez de su SOC, EDR, IDS), no una amenaza genérica: asumir un Blue Team competente y activo es el punto de partida correcto.</p>

<p>A nivel personal, el modelo de amenaza cambia según quién sea el sujeto: un ciberacosador, un competidor laboral, un estafador de ingeniería social o, en el extremo, un actor estatal. Un periodista, activista o denunciante que investiga temas sensibles debe modelar amenazas concretas, una expareja abusiva, una corporación, un gobierno, cada una con capacidades de recolección muy distintas (OSINT básico frente a vigilancia con orden judicial).</p>

<h3 id="tema-1.1.2-fase3">Fase 3: análisis de vulnerabilidades</h3>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea — el matiz que más se repite en las fuentes:</strong> una vulnerabilidad OPSEC no es lo mismo que una vulnerabilidad de ciberseguridad tradicional. Existe una vulnerabilidad OPSEC cuando un adversario es capaz de recolectar un indicador de información crítica, analizarlo correctamente y actuar de una manera que afecte los planes propios, no cuando hay un fallo de cifrado, un parche pendiente o una mala configuración por sí sola.</div>
</div>

<ul class="concept-list">
<li><strong>Pregunta clave 1:</strong> ¿qué indicador concreto expone la información crítica identificada en la Fase 1?</li>
<li><strong>Pregunta clave 2:</strong> ¿el adversario definido en la Fase 2 tiene realmente capacidad de captar y correlacionar ese indicador?</li>
<li><strong>Pregunta clave 3 (doctrina JP 3-13.3):</strong> ¿qué acciones pueden ser observadas por sistemas de inteligencia adversarios, y qué indicaciones podrían recolectarse, analizarse e interpretarse a tiempo para ser útiles al adversario?</li>
</ul>

<p>En pentesting, un ejemplo típico de vulnerabilidad OPSEC es usar la misma dirección IP para distintas fases de un ataque: facilita que el Blue Team identifique al atacante, y si esa IP se bloquea, el resto de la operación falla en cadena. El contexto es determinante: usar Firefox no es crítico, pero usar un navegador poco común basado en texto sí podría serlo; publicar la foto de un gato no es una vulnerabilidad, pero publicar una foto del equipo etiquetando a sus miembros sí lo es. Un rasgo único en una VM o un sistema, un nombre de host como "kali2021vm", un user-agent poco habitual, se convierte en un punto de pivote fácil para vincular actividades aparentemente separadas de vuelta a la operación.</p>

<p>A nivel personal, los ejemplos típicos son los metadatos EXIF en fotografías (geolocalización), la reutilización de un mismo nombre de usuario entre plataformas y los patrones de horario de publicación que revelan zona horaria o rutina.</p>

<h3 id="tema-1.1.2-fase4">Fase 4: evaluación de riesgos</h3>

<p>Esta fase combina el análisis de amenazas (Fase 2) y el de vulnerabilidades (Fase 3) para estimar la probabilidad y el impacto de que la información crítica se vea comprometida, y prioriza los esfuerzos de protección según la criticidad para la misión u organización, los requisitos regulatorios y los recursos disponibles. Es una fase bisagra: el análisis de amenazas informa directamente qué contramedidas (Fase 5) importan más.</p>

<ul class="concept-list">
<li><strong>Pregunta clave 1:</strong> dada esta vulnerabilidad y este adversario concreto, ¿cuál es la probabilidad real de explotación y cuál sería el impacto?</li>
<li><strong>Pregunta clave 2:</strong> ¿el coste de mitigar supera el beneficio de la mitigación?</li>
<li><strong>Pregunta clave 3:</strong> ¿se prioriza por impacto en la misión, no solo por gravedad técnica abstracta?</li>
</ul>

<p>El ejemplo de la IP reutilizada entre fases de un engagement es el mismo que en la Fase 3, visto desde otro ángulo: cada acción de escaneo por separado puede parecer de bajo riesgo, pero usar la misma IP en fases posteriores (phishing, C2) eleva el riesgo agregado del conjunto de la operación, no solo del escaneo puntual. La geolocalización es otro caso habitual: si una empresa solo tiene oficinas en dos ciudades y aparece un inicio de sesión desde una tercera ubicación o desde la IP de un proveedor cloud, la alerta salta de inmediato, los red teams deben simular ubicaciones y comportamientos realistas de usuario, que es exactamente evaluar el riesgo de un indicador concreto frente a la capacidad de detección real del cliente.</p>

<p>A nivel personal, el riesgo de reutilizar un alias o un correo no es constante: depende de quién esté mirando (un curioso frente al FBI con recursos de correlación de registros de dominio o hosting, como en los casos de Ulbricht y Cazes ya mencionados). Evaluar riesgo implica preguntarse qué adversario concreto, con qué capacidad, tiene motivo para correlacionar un dato, no tratar cada exposición como igual de grave.</p>

<h3 id="tema-1.1.2-fase5">Fase 5: aplicación de contramedidas</h3>

<p>El paso final consiste en aplicar contramedidas para evitar que los adversarios detecten información crítica, para inducirles interpretaciones alternativas mediante decepción, o para negar directamente su capacidad de recolección. Cuando una vulnerabilidad persiste incluso después de aplicar medidas, la decepción, acciones específicas para impedir que la inteligencia adversaria siga y recolecte información, generando confusión y pérdida de interés, es una vía adicional de mitigación.</p>

<ul class="concept-list">
<li><strong>Pregunta clave 1:</strong> ¿esta contramedida reduce realmente el riesgo, o solo traslada el indicador a otro lugar observable?</li>
<li><strong>Pregunta clave 2:</strong> ¿la contramedida en sí misma podría convertirse en un nuevo indicador?</li>
<li><strong>Pregunta clave 3:</strong> ¿es proporcional al riesgo evaluado en la Fase 4, o es un exceso de recursos sobre algo de bajo impacto?</li>
</ul>

<p>El error más citado en fuentes de red team es usar la misma dirección IP o el mismo proveedor para múltiples fases de un engagement: cuando el reconocimiento, el phishing y el C2 se originan todos desde la misma fuente, los defensores pueden conectar los puntos. La contramedida correspondiente es segmentar infraestructura por fase, separando IPs y proveedores entre reconocimiento, phishing y C2.</p>

<p>A nivel personal, las contramedidas típicas incluyen: conocer qué considera crítico la propia organización, proteger toda información sensible no clasificada, entender el concepto de agregación de datos, mantener conciencia del entorno y usar las redes sociales con precaución limitando la información publicada. De forma más concreta: separación estricta de identidades (correo, alias, dispositivo) entre la esfera personal y la operativa, retraso deliberado en publicar contenido geolocalizado, evitar patrones repetibles de horario o ubicación, y verificar metadatos antes de publicar cualquier contenido.</p>

<h3 id="tema-1.1.2-ciclo">Cómo se retroalimentan las fases</h3>

<p>Presentar estas cinco fases en una lista numerada sugiere un proceso lineal, pero la propia doctrina describe algo distinto. El análisis de amenazas (Fase 2) informa directamente la selección de contramedidas (Fase 5) al aclarar qué riesgos importan más, la Fase 5 no depende solo de la Fase 4 inmediatamente anterior, sino que remite hacia atrás a la Fase 2. Y a la inversa: si una contramedida genera un nuevo comportamiento observable, cifrar de repente comunicaciones que antes iban en claro, migrar abruptamente de infraestructura, ese cambio se convierte en un nuevo indicador candidato a analizar en la Fase 1 o la Fase 3 del ciclo siguiente. La doctrina JP 3-13.3 ya advierte de esto: un cambio drástico en los procedimientos puede, por sí solo, alertar al adversario de que algo se protege o de que una operación es inminente.</p>

<p>El mecanismo doctrinal formal de esta retroalimentación son las medidas de efectividad (MOE) y las medidas de desempeño (MOP): se monitorea la reacción del adversario ante las contramedidas aplicadas para determinar si funcionaron, y esa observación retroalimenta directamente una nueva vuelta de análisis de amenazas y vulnerabilidades. En un engagement de red team largo, tras aplicar una contramedida de segmentación de infraestructura (Fase 5), el equipo debe volver a la Fase 3 para verificar si las nuevas herramientas o TTPs introducidas generan nuevos indicadores, por ejemplo, un nuevo C2 con una huella TLS distintiva. El ciclo se reinicia con cada cambio táctico dentro de la misma operación, no una sola vez al planificarla.</p>

<h3 id="tema-1.1.2-errores">Errores comunes por fase</h3>

<div class="table-wrapper">
<table>
<thead><tr><th>Fase</th><th>Error común</th></tr></thead>
<tbody>
<tr><td>Fase 1 — Información crítica</td><td>Tratar todo como crítico por igual (sobre-clasificación), lo que diluye recursos y atención. Subestimar el efecto de agregación: descartar un dato aislado como "inofensivo" sin considerar que, combinado con otros, forma un patrón revelador.</td></tr>
<tr><td>Fase 2 — Amenazas</td><td>Confundir "amenaza genérica" (hackers en general) con el modelado de un adversario específico (intención y capacidad concretas). No reconsiderar la amenaza cuando cambia el contexto, por ejemplo asumiendo la misma madurez defensiva en todos los clientes o engagements.</td></tr>
<tr><td>Fase 3 — Vulnerabilidades</td><td>Confundir la vulnerabilidad OPSEC con la vulnerabilidad técnica de ciberseguridad tradicional — el error más citado explícitamente en las fuentes consultadas, incluso entre profesionales en formación.</td></tr>
<tr><td>Fase 4 — Riesgo</td><td>Evaluar el riesgo de forma aislada por acción individual sin considerar el riesgo acumulado de la operación completa. Confundir la ausencia de alertas con éxito o sigilo: la falta de alertas no siempre significa que no se ha sido detectado, a veces simplemente el objetivo no estaba registrando los logs relevantes.</td></tr>
<tr><td>Fase 5 — Contramedidas</td><td>Aplicar una contramedida que genera un indicador nuevo más visible que el original (cambio brusco de comportamiento). No prever comportamientos de terceros no controlados por el operador, como el reenvío de un señuelo a un equipo de soporte o su subida a un sandbox público.</td></tr>
</tbody>
</table>
</div>

</div>
</section>

<section class="tema-section" id="tema-1.1.3">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.3</span> Diferencias entre OPSEC, INFOSEC, COMSEC y PERSEC
</h2>
<div class="tema-content">

<p>Estos cuatro términos se usan a menudo como sinónimos, pero no pesan lo mismo en cuanto a rigor documental: OPSEC y COMSEC tienen definición oficial estandarizada con fuente normativa citable directamente; INFOSEC tiene definición legal formal, pero de alcance distinto al uso popular del término; y PERSEC presenta una ambigüedad terminológica notable que conviene señalar de forma explícita en vez de resolverla por conveniencia narrativa.</p>

<h3 id="tema-1.1.3-definiciones">Definición precisa de cada término</h3>

<p><strong>OPSEC (Operations Security).</strong> Origen militar en Vietnam (Purple Dragon), formalizado en la NSDD-298 de 1988. La CNSSI 4009-2015 recoge la misma definición: un proceso sistemático mediante el cual los adversarios potenciales pueden ser privados de información sobre capacidades e intenciones, identificando, controlando y protegiendo evidencia generalmente no clasificada de la planificación y ejecución de actividades sensibles.</p>

<p><strong>INFOSEC (Information Security / Information Systems Security).</strong> Su origen no es exclusivamente militar: la base legal más citada es el United States Code. El 44 U.S.C. §3542 —recodificado tras la FISMA de 2014 como §3552(b)(3), que conserva la misma definición sustantiva y añade no repudio y autenticidad dentro de integridad— define "seguridad de la información" como proteger la información y los sistemas de información contra el acceso, uso, divulgación, interrupción, modificación o destrucción no autorizados, para proporcionar confidencialidad, integridad y disponibilidad (el llamado "CIA triad"). El glosario NIST/CSRC, citando FIPS 200 y la CNSSI 4009-2015, reproduce esta misma definición.</p>

<p><strong>COMSEC (Communications Security).</strong> Más antiguo que OPSEC en su formalización, ligado a la criptografía de comunicaciones desde mediados del siglo XX. La definición del Departamento de Trabajo de EE.UU. lo describe como las medidas tomadas para negar a personas no autorizadas información derivada de las telecomunicaciones del gobierno de EE.UU. relativas a la seguridad nacional, y para asegurar la autenticidad de dichas telecomunicaciones. El glosario NIST/CSRC lo trata como un componente de la Garantía de la Información (IA) que incluye, a su vez, seguridad criptográfica, seguridad de transmisión, seguridad de emisiones y seguridad física — es decir, COMSEC es en sí mismo un término paraguas con subcomponentes propios (ver más abajo TRANSEC y EMSEC).</p>

<p><strong>PERSEC (Personnel/Personal Security).</strong> Es el término con mayor ambigüedad de los cuatro, y no existe una entrada de glosario CNSSI/NIST equivalente a las de OPSEC, INFOSEC y COMSEC. Tiene dos usos prácticamente no relacionados:</p>

<ul class="concept-list">
<li><strong>Uso informal de comunidad militar/familiar</strong> (el más habitual en internet): protección de datos personales del militar y su familia —dirección, rango, fechas de despliegue— frente a terceros que podrían usarlos para causar daño. Se describe en foros militares como un complemento de OPSEC: mientras OPSEC trata sobre las operaciones del día a día (fechas de despliegue, números de serie de armamento, movimientos de tropas), PERSEC trata sobre la seguridad personal de cada individuo y cómo resguarda su propia información, y en ocasiones se aplica con menos rigor que OPSEC.</li>
<li><strong>Uso oficial gubernamental ("Personnel Security" / programa PerSec):</strong> completamente distinto — es el proceso de vetting y habilitaciones de seguridad de empleados y contratistas (idoneidad para el puesto), no la protección de datos personales de un individuo frente a terceros.</li>
</ul>

<h3 id="tema-1.1.3-que-protege">Qué protege cada uno y dónde se solapan</h3>

<div class="table-wrapper">
<table>
<thead><tr><th>Disciplina</th><th>Objetivo central</th><th>Ejemplo típico de aplicación</th><th>Amenaza a la que responde</th></tr></thead>
<tbody>
<tr><td>OPSEC</td><td>Impedir que el adversario infiera capacidades o intenciones a partir de indicadores agregados, aunque cada dato individual no sea secreto</td><td>Evitar patrones de comportamiento reconocibles: horarios, rutas, reutilización de alias</td><td>Inteligencia por correlación/agregación (HUMINT, OSINT, SIGINT del adversario)</td></tr>
<tr><td>INFOSEC</td><td>Garantizar confidencialidad, integridad y disponibilidad (CIA) de la información en cualquier soporte</td><td>Clasificación de documentos, control de acceso, cifrado en reposo, políticas de retención</td><td>Acceso no autorizado, alteración o pérdida de disponibilidad de datos/sistemas</td></tr>
<tr><td>COMSEC</td><td>Proteger la transmisión de comunicaciones frente a interceptación y garantizar su autenticidad</td><td>Cifrado de radio militar, VoSIP, gestión de material criptográfico (claves)</td><td>Interceptación (SIGINT/COMINT), suplantación de comunicaciones</td></tr>
<tr><td>PERSEC (uso popular)</td><td>Evitar la exposición de datos identificatorios personales que permitan localizar o dañar a un individuo o su familia</td><td>No publicar direcciones, rutinas o fechas de despliegue en redes sociales</td><td>Doxing, ingeniería social dirigida, ataque físico dirigido</td></tr>
</tbody>
</table>
</div>

<p>El PERSEC "oficial" gubernamental (vetting de personal) no encaja en esta tabla del mismo modo que las otras tres filas: respondería más bien a la amenaza de un "insider" no confiable, y es un programa de recursos humanos/habilitaciones, no una disciplina de protección de la información personal de un individuo frente a terceros. Por eso se trata aparte y no se fuerza en la misma fila conceptual.</p>

<p>OPSEC e INFOSEC se complementan: mientras INFOSEC protege los activos digitales mediante controles sobre el dato o el sistema, OPSEC se asegura de que el comportamiento humano y los procesos operativos no comprometan información sensible de forma indirecta. El solape más relevante para pentesting es el de OPSEC y COMSEC: una comunicación cifrada correctamente (COMSEC correcto) puede filtrar igualmente metadatos de patrón de tráfico, a quién, cuándo y con qué frecuencia se comunica alguien, que constituyen un fallo de OPSEC aunque el contenido esté perfectamente protegido.</p>

<h3 id="tema-1.1.3-ejemplos">Fallos por disciplina en un mismo engagement</h3>

<p>El ejemplo más claro para distinguir estas disciplinas es verlas fallar por separado dentro de la misma operación de red team:</p>

<ul class="concept-list">
<li><strong>Fallo de COMSEC:</strong> el equipo usa un canal C2 sin cifrar o con cifrado débil, permitiendo que el Blue Team —o un tercero— intercepte el contenido de las comunicaciones entre el implante y el servidor de mando y control.</li>
<li><strong>Fallo de INFOSEC:</strong> los datos almacenados en la infraestructura del Red Team —vulnerabilidades encontradas, exploits, datos exfiltrados del cliente— quedan sin protección adecuada, por ejemplo un servidor de reportes sin control de acceso ni cifrado en reposo. Es un fallo clásico de confidencialidad/integridad de datos en reposo, no de OPSEC.</li>
<li><strong>Fallo de OPSEC:</strong> usar la misma IP o el mismo proveedor para reconocimiento, phishing y C2. El contenido de cada comunicación puede estar perfectamente protegido —COMSEC correcto, INFOSEC correcto—, pero el patrón de origen compartido permite al defensor correlacionar las fases y atribuir la operación completa. Este es el ejemplo más didáctico del contraste entre las tres disciplinas: se puede tener COMSEC e INFOSEC impecables y aun así fallar en OPSEC.</li>
<li><strong>Fallo de PERSEC personal</strong> dentro del mismo contexto: un operador de red team que publica en sus redes sociales fotos etiquetadas de la oficina del cliente, o celebra públicamente haber comprometido a tal empresa. No es un fallo del engagement técnico en sí, sino una exposición personal que puede vincular al operador —y por extensión al cliente— de forma no autorizada.</li>
</ul>

<p>En OPSEC personal, fuera de un contexto profesional, el mismo patrón se repite: usar una app de mensajería sin cifrado extremo a extremo para coordinar algo sensible es un fallo de COMSEC; reutilizar contraseñas entre servicios o no cifrar el disco de un portátil con datos sensibles es un fallo de INFOSEC; usar Signal y tener el disco cifrado pero publicar con regularidad horaria fotos con metadatos de ubicación es un fallo de OPSEC, porque el patrón agregado revela rutina y ubicación aunque ningún mensaje individual esté comprometido; y publicar el nombre completo de familiares, la dirección del domicilio o la rutina de los hijos en redes sociales es un fallo de PERSEC, exposición directa de datos identificatorios, no un fallo técnico de ningún sistema.</p>

<h3 id="tema-1.1.3-confusion">Por qué se confunden estos términos</h3>

<p>La causa raíz es histórica: el propio término INFOSEC, en su acepción más antigua ligada a la NSA, ya incluía como subcomponentes la "seguridad de personal" y la "seguridad de transmisión", antecesores de PERSEC y COMSEC. La superposición no es un error moderno de divulgación, sino que estuvo presente desde el origen porque INFOSEC nació como paraguas de varias disciplinas que hoy se tratan como términos separados.</p>

<p>La causa raíz conceptual, más citada en fuentes divulgativas modernas, es confundir "proteger el contenido o el sistema" (INFOSEC/COMSEC) con "proteger lo que se puede inferir del comportamiento" (OPSEC). Es el mismo patrón estructural que separa "seguridad de la información" de "ciberseguridad": la seguridad de la información es un término paraguas que incluye todos los datos, no solo los almacenados en el ciberespacio, y la ciberseguridad es un subconjunto suyo, no un sinónimo. Ese mismo esquema de "paraguas vs. subconjunto" se repite en la confusión entre OPSEC, INFOSEC y COMSEC.</p>

<p>El error conceptual concreto que produce la confusión de fondo es tratar una vulnerabilidad de OPSEC como si fuera una vulnerabilidad de ciberseguridad tradicional: en OPSEC, una vulnerabilidad significa que un adversario es capaz de hacer algo para contrarrestar los planes propios, un sentido distinto del habitual en ciberseguridad. Ese mismo error de traslación semántica ocurre entre disciplinas completas, no solo dentro de una fase del proceso.</p>

<p>Un factor de confusión adicional, específico de PERSEC, es la coexistencia de dos significados sin relación directa entre sí: cualquier intento de definir PERSEC "en general" es, en la práctica, un acto de elegir arbitrariamente una de las dos acepciones, algo que no ocurre del mismo modo con los otros tres términos.</p>

<h3 id="tema-1.1.3-relacionados">Términos relacionados: TRANSEC, EMSEC, SIGSEC</h3>

<p>COMSEC no es un término atómico: tiene subcomponentes formales y bien documentados.</p>

<ul class="concept-list">
<li><strong>TRANSEC (Transmission Security):</strong> subcomponente formal de COMSEC. Es el componente que resulta de aplicar medidas diseñadas para proteger las transmisiones de la interceptación y explotación por medios distintos al criptoanálisis —salto de frecuencia, espectro ensanchado. Uso activo y vigente, sobre todo en radiocomunicaciones militares y en despliegues 5G de uso militar.</li>
<li><strong>EMSEC (Emission Security):</strong> subcomponente formal de COMSEC relacionado con TEMPEST, enfocado en proteger información sensible de ser interceptada mediante emisiones electromagnéticas no intencionadas. Uso vigente pero de nicho: contramedidas TEMPEST, hardware de alta seguridad.</li>
<li><strong>SIGSEC (Signal Security):</strong> término militar más amplio que engloba tanto COMSEC como la protección frente a inteligencia de señales, incluyendo COMINT e interceptación de señales electromagnéticas no relacionadas con datos, como señales de radar. Uso histórico/doctrinal, menos citado hoy en fuentes civiles que TRANSEC o EMSEC.</li>
</ul>

<p>La jerarquía resultante es: COMSEC como paraguas; TRANSEC y EMSEC (junto con la criptoseguridad) como sus subcomponentes formales y bien documentados; SIGSEC como término histórico/doctrinal emparentado; y TECHSEC sin respaldo documental equivalente encontrado hasta la fecha.</p>

</div>
</section>

<section class="tema-section" id="tema-1.1.4">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.4</span> Por qué OPSEC no es anonimato — el modelo de capas de protección
</h2>
<div class="tema-content">

<p>Es habitual tratar "ser anónimo" y "tener buen OPSEC" como sinónimos. No lo son. El anonimato es un resultado deseado, y frágil; OPSEC es el proceso que, si se sostiene en el tiempo, puede producir ese resultado. Se puede tener una herramienta de anonimato técnicamente intachable y aun así ser identificado, y se puede tener un proceso de OPSEC sólido sin que eso implique anonimato absoluto frente a todos los observadores posibles.</p>

<h3 id="tema-1.1.4-concepto">Anonimato vs. OPSEC (y privacidad)</h3>

<p>El anonimato significa aumentar el coste, el esfuerzo y la incertidumbre necesarios para atribuir una acción a una identidad real del mundo físico. Una identidad se considera "anónima" cuando la atribución se vuelve poco fiable, no imposible, y el anonimato sin un modelo de amenaza definido carece de sentido práctico.</p>

<p>Conviene distinguir también un tercer término con el que se confunde: la <strong>privacidad</strong>. El anonimato consiste en mantener oculta la identidad, pero no necesariamente las acciones, por ejemplo, publicar con un pseudónimo en redes sociales; la privacidad consiste en mantener ciertas cosas reservadas, lo que puede incluir las propias acciones, por ejemplo, enviar mensajes privados a amigos que saben quién los envía, pero que solo ellos pueden leer. La seguridad, las precauciones para mantenerse a salvo, suele ser un prerrequisito de la privacidad en línea, pero es menos determinante para el anonimato en sí.</p>

<p>La relación entre anonimato y OPSEC tiene una dirección concreta: lograr anonimato real requiere buena seguridad operacional para asegurar que, por ejemplo, la dirección IP real no quede revelada. El anonimato es el resultado; OPSEC es el proceso que lo sostiene o lo hace colapsar.</p>

<h3 id="tema-1.1.4-capas">El modelo de capas de protección</h3>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado — nota de honestidad metodológica:</strong> no existe una fuente oficial o académica única que formalice exactamente "un modelo de cinco capas" con este nombre y esta estructura cerrada. Lo que sigue es una síntesis construida a partir de casos documentados y de una idea que sí aparece en fuentes divulgativas: cada presencia en línea tiene una "superficie de identidad" —la suma de todas las señales expuestas—, y reducir el riesgo de desanonimización consiste en reducir y controlar esa superficie, no en eliminarla. Cada capa descrita aquí es una categoría de señal dentro de esa superficie, no un marco cerrado atribuible a un documento concreto.</div>
</div>

<ul class="concept-list">
<li><strong>Capa de red/técnica:</strong> herramientas como Tor, VPN o proxies, que ocultan el origen técnico del tráfico. Es la capa más discutida en fuentes populares y también la más citada como insuficiente por sí sola.</li>
<li><strong>Capa de identidad:</strong> separación entre identidades y alter egos —correo, alias, dispositivo— para que una no pueda vincularse a la otra.</li>
<li><strong>Capa de comportamiento:</strong> patrones, horarios y estilo de escritura. El comportamiento es, según varias fuentes, el identificador más fuerte: un sistema puede ocultar de dónde viene el tráfico mientras revela quién eres a través del ritmo temporal, el lenguaje, las elecciones y la repetición.</li>
<li><strong>Capa de metadatos:</strong> información incrustada en archivos —EXIF, timestamps, cabeceras de correo, metadatos de documentos— que puede revelar ubicación, autoría o momento de creación aunque el contenido esté protegido.</li>
<li><strong>Capa humana/social:</strong> exposición a través de terceros —conversaciones informales, redes sociales personales, contactos de confianza— que puede filtrar información incluso cuando el propio operador mantiene disciplina técnica.</li>
</ul>

<h3 id="tema-1.1.4-casos">Casos documentados por capa</h3>

<p>Un patrón se repite en todos los casos verificados en esta investigación: en ninguno hubo una rotura criptográfica o técnica de Tor o de una VPN. La herramienta de anonimato funcionó exactamente como se supone que debía funcionar; el colapso vino de otra capa.</p>

<p><strong>Capa de red/contexto — Eldo Kim, amenaza de bomba en Harvard (2013).</strong> Kim usó Tor y Guerrilla Mail (un servicio de correo temporal) para enviar una amenaza de bomba anónima. La Universidad de Harvard pudo determinar que, en las horas previas al envío, Kim había accedido a Tor usando la red inalámbrica de Harvard, que requiere autenticación con usuario y contraseña. Los investigadores cruzaron los registros de conexión a esa red inalámbrica con las direcciones IP públicas conocidas de Tor en la franja horaria del envío, reduciendo la lista de sospechosos a un grupo muy pequeño. Bruce Schneier resumió el mecanismo con una frase ya convertida en referencia de la industria: "El FBI no tuvo que romper Tor; simplemente usaron mecanismos policiales convencionales para conseguir que Kim confesara. Tor no se rompió; Kim sí."</p>

<p><strong>Capa de metadatos — John McAfee, fuga en Guatemala (2012).</strong> Un usuario de Twitter notó que una fotografía de McAfee publicada por la revista Vice contenía metadatos EXIF con las coordenadas GPS exactas de dónde se había tomado: junto a la piscina de un resort en Guatemala. El fallo de metadatos no fue de McAfee directamente, sino del fotógrafo o técnico de Vice que subió la imagen sin limpiar sus metadatos, un matiz importante: la capa de metadatos puede fallar por terceros no controlados por el propio operador, incluso cuando este mantiene buena disciplina personal.</p>

<p><strong>Capa de identidad — Ross Ulbricht / Silk Road</strong>. Silk Road operaba correctamente como servicio oculto de Tor: el fallo no fue de la capa técnica de anonimización de la red, sino de la capa de identidad y comportamiento del operador (reutilización del alias "altoid", correo personal, publicación en LinkedIn). Una fuente reciente sobre fallos catastróficos de OPSEC describe este patrón como una acumulación de errores aparentemente menores y no correlacionados entre sí que, sumados, crean una vía innegable para la investigación forense, el colapso rara vez es un solo fallo, sino una reacción en cadena.</p>

<p><strong>Capa de comportamiento/estilo — J.K. Rowling / "Robert Galbraith" (2013).</strong> Rowling publicó la novela "The Cuckoo's Calling" bajo el pseudónimo Robert Galbraith en abril de 2013. La sospecha se originó en un tuit anónimo que acusó a Rowling de ser la autora; a partir de esa acusación, el análisis estilométrico —comparando el estilo de escritura con las novelas de Harry Potter y con obras de otras autoras del mismo género, mediante el software JGAAP— confirmó la autoría en julio de 2013. Es importante no invertir esta secuencia: la estilometría confirmó una sospecha ya circulante, no fue el método que destapó el caso desde cero. Es, aun así, el ejemplo académico mejor documentado de que el estilo de escritura por sí solo puede desanonimizar a un autor sin que medie ninguna herramienta técnica de por medio.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado — límites del método:</strong> la estilometría no es una prueba concluyente. Fuentes académicas y periodísticas citadas para este caso señalan que es mucho menos fiable que el ADN y que los lingüistas forenses trabajan con probabilidades, no con certezas. No debe presentarse como una herramienta infalible de desanonimización.</div>
</div>

<p><strong>Capa de comportamiento/patrón temporal — Jeremy Hammond (LulzSec)</strong> Hammond utilizaba Tor para ocultar su dirección IP, pero en conversaciones por IRC con "Sabu" (Hector Monsegur) reveló que había cumplido condena en una prisión federal. Ese dato biográfico, combinado con otras pistas sobre los grupos de hacktivismo en los que participaba, permitió al FBI acotar el círculo de sospechosos y obtener una orden judicial para monitorizar su tráfico de internet. El anonimato de red no fue vulnerado en ningún momento; el fallo fue exclusivamente de la capa de comportamiento y de gestión de identidad conversacional.</p>

<h3 id="tema-1.1.4-proceso">Estado puntual vs. proceso continuo</h3>

<p>OPSEC no consiste en lograr el anonimato una vez, sino en mantener la incertidumbre a lo largo del tiempo. En el momento en que el comportamiento se vuelve predecible, el anonimato empieza a fallar, sin importar cuán fuerte parezca la capa técnica. El anonimato pleno exige usar de forma consistente las herramientas y hábitos de protección en todos los aspectos de la propia vida en línea, porque incluso una falta temporal y puntual de disciplina es suficiente para exponer una identidad, basta un solo momento de descuido, como el acceso a Tor desde una red autenticada o un inicio de sesión sin proxy, para colapsar retroactivamente meses de buena disciplina.</p>

<p>El modelo del caso Ulbricht/FIN7 descrito antes como "acumulación de errores" ilustra el mismo principio desde otro ángulo: el colapso de OPSEC no suele ser un evento único, sino la acumulación de múltiples fallos a lo largo del proceso, justo lo opuesto de un estado binario de "anonimato logrado o no logrado".</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea:</strong> los casos documentados en este apartado involucran objetivos perseguidos por agencias con recursos de investigación excepcionales (FBI, DEA, fiscalías federales) durante meses o años. No debe generalizarse implícitamente que "así es como cualquier adversario correlacionará tus datos": el modelo de amenaza de un usuario frente a un acosador o un competidor comercial es muy distinto al de alguien perseguido por el FBI. La capa que importa proteger depende, precisamente, de quién sea el adversario definido en el análisis de amenazas.</div>
</div>

<h3 id="tema-1.1.4-aplicacion">Aplicación de las capas: red team vs. personal</h3>

<div class="table-wrapper">
<table>
<thead><tr><th>Capa</th><th>Ejemplo en red team / pentesting</th><th>Ejemplo en OPSEC personal</th></tr></thead>
<tbody>
<tr><td>Red/técnica</td><td>Usar la misma IP o el mismo proveedor para reconocimiento, phishing y C2 permite a los defensores conectar los puntos</td><td>Usar Tor/VPN de forma inconsistente para la misma actividad crea una discontinuidad detectable en los logs de acceso (análogo al caso Kim)</td></tr>
<tr><td>Identidad</td><td>Un hostname único como "kali2021vm" se convierte en un punto de pivote fácil para vincular actividades separadas de vuelta a la operación</td><td>Reutilizar un alias entre un foro "anónimo" y una cuenta profesional (caso Ulbricht/"altoid")</td></tr>
<tr><td>Comportamiento</td><td>Patrones de horario de phishing/escaneo que no coinciden con el huso horario o la jornada laboral simulada de un empleado real del cliente</td><td>Publicar siempre en la misma franja horaria, o mantener un estilo de escritura reconocible entre una identidad anónima y una pública (casos Rowling, estilometría en foros darknet)</td></tr>
<tr><td>Metadatos</td><td>Documentos de phishing o payloads con metadatos de autor/organización sin limpiar (autor de Word, ruta de compilación, timestamps)</td><td>Fotos con EXIF/GPS sin limpiar antes de publicar (caso McAfee)</td></tr>
<tr><td>Humana/social</td><td>Un operador que comenta en redes sociales personales detalles de un engagement en curso, o un miembro del equipo que revela información en una conversación informal</td><td>Revelar detalles de la propia operación o identidad a un contacto de confianza que después, voluntaria o involuntariamente, expone esa información</td></tr>
</tbody>
</table>
</div>

</div>
</section>

<section class="tema-section" id="tema-1.1.5">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.5</span> OPSEC ofensivo vs defensivo: el atacante también deja huella
</h2>
<div class="tema-content">

<h3 id="tema-1.1.5-conceptos">OPSEC ofensivo vs. OPSEC defensivo</h3>

<p><strong>OPSEC ofensivo</strong> (aplicado por quien ataca o testea) es el conjunto de prácticas para minimizar la huella detectable de la propia operación, infraestructura, herramientas, comportamiento, de modo que el defensor no pueda atribuir, correlacionar o anticipar la actividad antes de que se cumplan los objetivos de la operación o, en un red team, antes de que se agote el tiempo de evaluación planificado. <strong>OPSEC defensivo</strong> es, desde el lado de quien protege una organización, el trabajo de detectar, correlacionar y atribuir esa huella, la disciplina del Blue Team y de threat intelligence que convierte los descuidos del operador ofensivo en indicadores accionables.</p>

<p>En la jerga de red teaming, ambos términos no son dos aplicaciones análogas del mismo concepto sobre objetos distintos, sino dos roles con objetivos opuestos dentro del mismo ejercicio: el objetivo del Red Team no es proteger información, esa es tarea del Blue Team, sino proteger sus propios procesos, de modo que sea difícil para el Blue Team saber qué está haciendo el Red Team en cada momento.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Término sin glosario oficial:</strong> a diferencia del OPSEC "clásico" (formalizado vía NSDD-298), "OPSEC ofensivo" no tiene una entrada de glosario oficial equivalente. Es una adaptación de la comunidad de red teaming/pentesting, con variaciones de énfasis entre guías distintas: unas lo centran en infraestructura de C2, otras en la separación entre clientes, otras en la higiene de logs.</div>
</div>

<p>El nivel de rigor exigido no es el mismo en todos los ejercicios ofensivos autorizados. A diferencia de un pentest, un red team suele ser no anunciado, o conocido solo por un grupo reducido de ejecutivos: el equipo de seguridad, los analistas del SOC y los respondedores de incidentes operan en condiciones normales, sin saber que están siendo evaluados, lo que permite una evaluación auténtica de las capacidades defensivas. Los red teams suelen operar durante semanas o meses, no días, moviéndose despacio y con cuidado para evitar la detección, imitando a una amenaza persistente avanzada (APT). En un pentest tradicional el OPSEC ofensivo importa menos, porque no hay pretensión de sigilo; en un red team es el núcleo mismo del ejercicio.</p>

<h3 id="tema-1.1.5-huella">Qué huella deja el operador aunque la técnica sea correcta</h3>

<p>El principio central es que se puede tener el cifrado y la infraestructura técnicamente impecables y aun así dejar una huella identificable, porque la huella no está en el contenido, sino en el patrón.</p>

<p><strong>Huella en el handshake TLS.</strong> JA3 y JA3S combinan valores del Client Hello y del Server Hello, versión, cifrados aceptados, extensiones, curvas elípticas, y los reducen a un hash. Ese hash identifica la herramienta o el framework subyacente, no la IP ni el dominio de destino.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea — el caso más directo de este apartado:</strong> un equipo de pentest <em>autorizado</em> fue detectado por el equipo de ingeniería de Salesforce; tras la erradicación, movió su imagen de C2 a otra IP y dominio, pero el malware y el servidor seguían siendo la misma aplicación, así que las huellas JA3/JA3S se mantuvieron idénticas y la detección volvió a funcionar de inmediato. Los pentesters compraron entonces espacio en un proveedor distinto, un certificado nuevo y un dominio nuevo, y la detección fue igualmente instantánea, porque se basaba en la infraestructura y la tecnología subyacente, no en indicadores fáciles de rotar como IPs, dominios o certificados. En este caso concreto, ser detectado era el resultado esperado y valioso del ejercicio para el cliente, no un fracaso operativo: es exactamente la validación de detección por la que se contrata un red team.</div>
</div>

<p>Frameworks de C2 como Cobalt Strike sin personalizar son identificables de inmediato a partir de logs de red pasivos; herramientas de escaneo como Masscan o ZMap envían mensajes ClientHello mínimamente elaborados que ningún navegador legítimo enviaría; incluso los clientes de Tor emiten un perfil TLS fijo que no ha cambiado sustancialmente entre versiones. Mientras JA3 identifica al cliente, <strong>JARM</strong> identifica al servidor: envía paquetes TLS especialmente diseñados y registra cómo responde. Muchos operadores usan configuraciones por defecto, por lo que sus servidores C2 a menudo comparten el mismo hash JARM en todo internet, lo que permite pivotar de un único indicador a toda una campaña.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado:</strong> la huella TLS no es un indicador infalible. Se ha documentado un aumento significativo de huellas TLS distintas entre 2018 y 2019, lo que sugiere que los autores de malware adoptaron técnicas de aleatorización de JA3/JA3S para evadir detección basada en firmas estáticas, las firmas JA3/JA3S deben tratarse como indicadores complementarios, no como método primario de detección.</div>
</div>

<p><strong>Huella de comportamiento temporal (timing/beaconing).</strong> Herramientas de threat hunting como RITA están diseñadas para detectar el ritmo de beaconing incluso cuando se aplica jitter, puntuando la periodicidad estadística a través de múltiples conexiones.</p>

<p>El caso Jeremy Hammond, donde el FBI cruzó horarios de conexión IRC con presencia física en el domicilio, es, en esencia, el mismo principio de detección por timing aplicado fuera del contexto puramente técnico. En ese caso, sin embargo, se trataba de un actor real bajo investigación criminal, no de un ejercicio autorizado.</p>

<p><strong>Huella de reutilización de infraestructura entre operaciones.</strong> Es el error más citado en las guías de red teaming: usar la misma dirección IP o el mismo proveedor para múltiples fases de un engagement, el ejemplo que mejor separa OPSEC de COMSEC/INFOSEC.</p>

<p><strong>Huella forense en disco y logs.</strong> Un análisis que examina de forma conjunta a Ross Ulbricht (actor criminal condenado), el sindicato de cibercrimen FIN7 y actores estatales rusos, incluido el grupo conocido como Volt Typhoon, describe un patrón recurrente: malware personalizado y tácticas avanzadas son constantemente socavados por fallos rudimentarios en la gestión de identidad, el endurecimiento de infraestructura y la configuración de herramientas, fuga de identidad a través de fragmentos de código público, configuraciones inseguras por defecto en frameworks de C2 como Cobalt Strike, exposición de datos por servidores mal configurados y reutilización de huellas de infraestructura.</p>

<h3 id="tema-1.1.5-infraestructura">Infraestructura de operación: redirectores y compartimentación</h3>

<p>El modelo de infraestructura más repetido en las guías técnicas de red teaming sigue una arquitectura por etapas: Objetivo → Redirector Stage 0 → Servidor de Staging (phishing/acceso inicial) → Redirector Stage 1 → Servidor Long-Haul (persistencia) → Redirector Stage 2 → Servidor Interactivo (post-explotación) → Redirector Stage 3 → Servidor de Exfiltración.</p>

<p>Un redirector es un servidor HTTPS con un certificado SSL válido sobre un dominio categorizado y "envejecido", que reenvía el tráfico del implante al team server y sirve contenido señuelo a cualquier otra solicitud. El principio detrás de esta arquitectura es la compartimentación de fallos: si un defensor encuentra el endpoint de la CDN, aun así no puede alcanzar el team server; si el redirector se "quema", se levanta uno nuevo y se vuelve a apuntar la CDN, mientras el team server permanece intacto. Cada etapa usa infraestructura completamente aislada, dominios, proveedores de VPS, IPs y certificados distintos, y ningún dominio se reutiliza entre payloads, tráfico de C2 y phishing: si un dominio se quema, solo se pierde esa función.</p>

<ul class="concept-list">
<li><strong>Separación por cliente:</strong> mantener infraestructura completamente separada para cada cliente u operación es un principio básico de la configuración de infraestructura de red team, junto con la rotación regular de sus componentes.</li>
<li><strong>Envejecimiento de dominios:</strong> los sistemas de reputación ponderan mucho la edad de un dominio; uno registrado seis horas antes de su primer uso se trata de forma muy distinta a uno registrado seis meses antes y usado ligeramente durante el tiempo intermedio. La adquisición debe planificarse con semanas de antelación, y comprar dominios expirados con uso legítimo previo es una práctica común.</li>
<li><strong>Rotación de redirectores:</strong> no se ejecuta un servidor de C2 de forma indefinida sobre la misma IP; se rota cada 7 a 14 días en engagements activos.</li>
<li><strong>Segmentación por confianza según etapa:</strong> la etapa de largo alcance (post-explotación) usa la infraestructura de mayor confianza —dominios más antiguos, frecuencia de beacon más baja— y, a menudo, un framework distinto al de la etapa de acceso inicial, para evitar que el compromiso de una sola herramienta arrastre toda la cadena.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Límite ético/legal que no existe para un atacante real:</strong> las Rules of Engagement de un pentest o red team autorizado limitan qué tan "ofensivo" puede ser el propio OPSEC. Un atacante malicioso real no tiene ningún límite para comprometer infraestructura de terceros como parte de su cadena de redirectores; un red team autorizado, en cambio, está limitado por el alcance contratado también en su propia infraestructura, no puede, por ejemplo, secuestrar servidores de terceros no autorizados para usarlos como redirectores, algo que sí estaría al alcance técnico de un atacante real. Es una diferencia estructural entre ambos "OPSEC ofensivos", no solo una diferencia de intención.</div>
</div>

<h3 id="tema-1.1.5-deteccion">Cómo detecta el Blue Team esos fallos</h3>

<p>El marco de referencia para entender qué indicadores importan más es la <strong>Pirámide del Dolor</strong>, desarrollada por David Bianco en 2013 durante las investigaciones de APT1 en Mandiant. Describe seis niveles de indicadores de compromiso (IOC), de menos a más costoso de cambiar para el atacante: valores hash, direcciones IP, nombres de dominio, artefactos de red y de host, herramientas, y finalmente tácticas, técnicas y procedimientos (TTP).</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado:</strong> algunas fuentes secundarias separan los artefactos de red y de host en dos niveles distintos, llegando a siete niveles en vez de seis. La versión de seis niveles es la más citada y se mantiene aquí, pero conviene saber que existe esta variación menor entre fuentes.</div>
</div>

<p>Un atacante puede cambiar con facilidad valores hash, IPs y dominios, los tres niveles más bajos; las TTP, en el nivel superior, son las más difíciles de cambiar, porque en esencia se reducen a comportamientos del adversario. Por eso las TTP son el indicador en el que los defensores deben enfocarse para detecciones robustas basadas en conocimiento previo. El caso Salesforce/JA3-JA3S ya descrito es el ejemplo perfecto de "subir en la pirámide": el equipo defensor dejó de perseguir IP o dominio, niveles bajos, fáciles de rotar, y empezó a perseguir la huella de la herramienta y la infraestructura subyacente, nivel alto, difícil de cambiar sin rehacer todo el stack.</p>

<p>La correlación de infraestructura vía threat intelligence sigue un patrón repetible más allá de JA3: se parte de un dominio sospechoso encontrado en un correo de phishing; se enriquece usando Shodan o Censys para obtener el hash JARM del servidor de ese dominio; se pivota buscando ese hash JARM único en todo internet; y el resultado puede ser el descubrimiento de otras direcciones IP alojando el mismo framework de C2, aunque no hayan atacado todavía al analista, inteligencia operativa proactiva, no solo reactiva.</p>

<p>La reutilización de TTP es, además, la base de buena parte de la atribución: los actores de amenaza reutilizan técnicas y procedimientos por familiaridad operativa, por las cadenas de herramientas disponibles o por restricciones de infraestructura, y los analistas aprovechan esa consistencia para construir firmas de comportamiento, perfiles compuestos basados en patrones de TTP.</p>

<h3 id="tema-1.1.5-frameworks">Frameworks: MITRE ATT&CK, TIBER-EU y Rules of Engagement</h3>

<p><strong>MITRE ATT&CK</strong> no es un feed tradicional de inteligencia de amenazas con indicadores de compromiso en tiempo real: se centra en las TTP. Incluye "Campaigns", operaciones específicas o series de actividad realizadas por grupos de amenaza, dirigidas a organizaciones, sectores o geografías particulares; la versión 18 del framework (octubre de 2025) contenía 55 campañas identificadas.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado:</strong> el número de campañas de ATT&CK cambia con cada actualización semestral (30 en la v15, 42 en la v16, 50 en la v17, 55 en la v18) — es una cifra específica de la versión consultada, no un dato fijo.</div>
</div>

<p>El ecosistema alrededor de ATT&CK incluye ATT&CK Navigator (visualización), el MITRE Cyber Analytics Repository, CAR, (analíticas de detección), Caldera (red teaming automatizado basado en técnicas ATT&CK) y Atomic Red Team, de Red Canary (pruebas de defensas contra técnicas específicas). El uso del framework difiere según el rol: los equipos de threat intelligence lo usan para investigar técnicas empleadas por adversarios, los equipos rojos para emulación de adversarios y validación de seguridad, los equipos azules para mejorar la detección, y los equipos púrpura como puente entre ambos, no hay una única "lectura" del framework, sino usos paralelos según el rol.</p>

<p><strong>TIBER-EU</strong> es el ejemplo más formal y regulatorio de que el OPSEC ofensivo de un red team no es opcional ni informal. Fue desarrollado conjuntamente por el Banco Central Europeo y los bancos centrales nacionales de la UE, aprobado por el Consejo de Gobierno del BCE y publicado en mayo de 2018, como respuesta estratégica a la creciente sofisticación de los ciberataques dirigidos a infraestructura crítica. A diferencia de las pruebas de penetración convencionales, TIBER-EU utiliza inteligencia de amenazas del mundo real para imitar las TTP empleadas por adversarios reales, sobre los sistemas críticos de producción en vivo de las entidades. Los cinco equipos que participan en una prueba TIBER-EU son:</p>

<div class="table-wrapper">
<table>
<thead><tr><th>Equipo</th><th>Rol</th></tr></thead>
<tbody>
<tr><td>Blue Team</td><td>Personal de la entidad evaluada, sin previo aviso de la prueba</td></tr>
<tr><td>Threat Intelligence Provider</td><td>Analiza amenazas reales y realiza el reconocimiento previo</td></tr>
<tr><td>Red-Team Testers</td><td>Ejecutan el ataque simulado basado en esa inteligencia</td></tr>
<tr><td>White Team / Control Team</td><td>Pequeño grupo interno que sí conoce la prueba y la coordina</td></tr>
<tr><td>TIBER Cyber Team</td><td>Equipo de la autoridad supervisora que garantiza el cumplimiento del marco</td></tr>
</tbody>
</table>
</div>

<p>Las <strong>Rules of Engagement (RoE)</strong> son el marco de gobernanza que autoriza y limita el OPSEC ofensivo en un engagement legítimo. Distinguen explícitamente el alcance dentro ("in-scope": redes, dominios, ubicaciones físicas y personal autorizados), el alcance fuera ("out-of-scope": sistemas, datos e individuos estrictamente prohibidos) y el "no definido", qué hacer cuando se identifican activos del cliente que no están ni dentro ni fuera del alcance. Incluyen también una lista detallada de TTP autorizadas y prohibidas: acciones que el cliente podría percibir como destructivas o que no quiere arriesgar.</p>

<h3 id="tema-1.1.5-por-que-importa">Por qué importa en un engagement autorizado</h3>

<p>El OPSEC ofensivo en un contexto autorizado cumple funciones que no existen para un atacante malicioso, precisamente porque el objetivo no es solo evitar la detección, sino ejecutar el ejercicio de forma segura y útil para el cliente.</p>

<ul class="concept-list">
<li><strong>Evitar contaminar los sistemas del cliente:</strong> fijar un marco temporal preciso ayuda a los equipos SOC a diferenciar la actividad legítima de pruebas de la de un ataque real, reduciendo falsos positivos. La "planificación de supresión de alertas" consiste en informar de antemano a los equipos SOC sobre qué tráfico esperar.</li>
<li><strong>De-conflicción:</strong> las acciones del pentest deben poder identificarse frente al equipo de seguridad del cliente para evitar conflictos; las IPs o herramientas usadas pueden hacer saltar alertas, y para evitar ser bloqueado puede ser necesario incluirlas en una lista blanca durante el periodo de pruebas. Los canales de comunicación con el cliente también sirven para confirmar si un resultado extraño es un falso positivo.</li>
<li><strong>Distinguir la propia actividad de una intrusión real:</strong> los métodos de un red team pueden ser intrusivos, pero no deben ser destructivos, y se detienen si se descubre evidencia de una intrusión real en curso, el equipo es responsable de informar al contacto designado del cliente si esto ocurre. Es una función que no existe para un atacante malicioso: distinguir la propia simulación de un ataque genuino de un tercero, para poder alertar al cliente.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Tensión no resuelta en la comunidad:</strong> existe una tensión real entre avisar pronto al SOC para evitar falsos positivos y retrasar esa notificación para no invalidar la prueba de detección. Si el equipo azul recibe aviso anticipado de cada fase, la evaluación de detección deja de ser fiable; por eso se recomienda retrasar la notificación hasta alcanzar hitos clave. No hay una única postura sobre cuánto y cuándo comunicar: depende de si el objetivo declarado del ejercicio es medir la capacidad de detección (comunicación más restringida) o simplemente validar vulnerabilidades técnicas (pentest clásico, con whitelisting y comunicación más abierta desde el inicio).</div>
</div>

<p>Por eso el primer paso de cualquier ejercicio ofensivo autorizado es decidir qué se está probando realmente: si el objetivo es comprobar si el SOC puede detectar movimiento lateral, o si un correo de phishing puede llegar a finanzas, el nivel de sigilo exigido y el momento de comunicar al Blue Team cambian por completo. Mapear la prueba contra MITRE ATT&CK da un lenguaje compartido entre el equipo ofensivo y quienes defienden la red, y es, en última instancia, lo que convierte el "OPSEC ofensivo" de una simple cuestión de no ser detectado en una herramienta al servicio de un objetivo de seguridad medible y acordado con el cliente.</p>

</div>
</section>

<section class="tema-section" id="tema-1.1.6">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.6</span> OPSEC by design: desde el primer minuto, no como parche
</h2>
<div class="tema-content">

<h3 id="tema-1.1.6-concepto">Qué significa "OPSEC by design"</h3>

<p>La base analógica es <strong>Privacy by Design</strong>, desarrollado por Ann Cavoukian, entonces Comisionada de Privacidad de Ontario, Canadá, desde los años 90 y publicado formalmente en agosto de 2009 (revisado en enero de 2011). Su idea central: el enfoque se caracteriza por adoptar medidas proactivas en vez de reactivas, anticipando y previniendo eventos invasivos de la privacidad antes de que ocurran, en vez de ofrecer remedios una vez que ya han ocurrido. Privacy by Design llega antes del hecho, no después.</p>

<p>Los siete principios fundacionales del marco son: proactivo, no reactivo (preventivo, no remedial); privacidad como configuración por defecto; privacidad incorporada en el diseño; funcionalidad completa (de suma positiva, no de suma cero); seguridad de extremo a extremo, con protección durante todo el ciclo de vida; visibilidad y transparencia; y respeto por la privacidad del usuario, manteniendo el enfoque centrado en la persona. En octubre de 2010, la Conferencia Internacional de Autoridades de Protección de Datos y Comisionados de Privacidad aprobó por unanimidad una resolución que reconoce Privacy by Design como componente esencial de la protección fundamental de la privacidad; desde entonces se ha traducido a 37 idiomas.</p>

<p>Trasladado al vocabulario de OPSEC, "by design" significaría aplicar esa misma lógica, anticipar y prevenir, no remediar, a la gestión de la identidad operativa (en un pentest) o de la identidad personal: separar compartimentos, aislar infraestructura y fijar hábitos de comportamiento antes de que exista cualquier vínculo entre la identidad protegida y la identidad real, en vez de intentar "limpiar" esa relación después de que ya se haya establecido.</p>

<h3 id="tema-1.1.6-porque-falla-parche">Por qué remediar a posteriori casi nunca funciona</h3>

<p>Como se ha visto, un fallo en identificar un dato como crítico arrastra el resto de fases de OPSEC. El punto adicional aquí es estructural: una vez que un dato no protegido ha sido expuesto, indexado, cacheado, citado por terceros, archivado en un registro que no está bajo el propio control, revertir esa exposición es, en la práctica, extremadamente difícil.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado — matiz importante:</strong> esta irreversibilidad no debe presentarse como una ley absoluta sin excepciones. Existen mecanismos parciales de reversión, solicitudes de retirada a motores de búsqueda, "derecho al olvido" en jurisdicciones donde existe legislación aplicable, eliminación de cachés bajo ciertas condiciones, aunque son limitados y poco fiables. Es más preciso hablar de una tendencia empírica muy fuerte hacia la irreversibilidad práctica que de una imposibilidad absoluta.</div>
</div>

<p>El caso de Ross Ulbricht ilustra bien por qué "parchear" después no basta. Ulbricht usó el alias "altoid" en varios foros para anunciar Silk Road a comienzos de 2011, y volvió a usarlo después para contratar desarrolladores, pidiendo currículums a una dirección de correo personal identificable — el alias ya llevaba tiempo existiendo como identidad pública antes de que se intentara usarlo como cobertura operativa; no hubo separación desde el minuto cero. Cuando más tarde cambió el nombre de usuario a "frosty" y el correo a frosty@frosty.com, ese cambio no rompió la cadena: la extendió. El análisis forense del servidor incautado encontró una clave pública SSH con el comentario <code>frosty@frosty</code> en el archivo de claves autorizadas del servidor de administración de Silk Road, creando una línea trazable desde la pregunta de StackOverflow hasta la administración del servidor. El cambio de alias, hecho después de que ya existiera un vínculo, simplemente añadió un eslabón más a la cadena.</p>

<p>El caso de Hector Monsegur / "Sabu" ofrece otro ejemplo de vínculo fijo creado antes o al margen de la disciplina operativa posterior: un dominio a veces mencionado por Sabu, prvt.org, había sido registrado usando su nombre y dirección reales. Una vez creado ese registro, no había forma de "arreglarlo" después sin abandonar el dominio por completo, y aun así, el registro histórico ya existía.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea:</strong> ninguno de estos casos fue una única exposición fatal e instantánea. Fue una escalada progresiva de vínculos, alias, correo personal, pregunta en StackOverflow, cambio de alias, clave SSH, en el caso Ulbricht, la que resultó fatal, coherente con el modelo de "acumulación de errores" descrito anteriormente. No debe leerse esto como "un solo error acaba con todo": lo que falla es la acumulación de vínculos menores, no necesariamente uno solo, y muchos de esos vínculos no están bajo el control de quien intenta corregir su OPSEC después del hecho.</div>
</div>

<h3 id="tema-1.1.6-compartimentacion">Compartimentación como principio central</h3>

<p>La compartimentación, en seguridad de la información, es la limitación del acceso según la necesidad de conocer ("need-to-know") para realizar ciertas tareas. Se originó en el manejo de información clasificada en aplicaciones militares y de inteligencia, y se remonta a la antigüedad: se usó con éxito para mantener el secreto del fuego griego, un caso documentado en una fuente académica indexada sobre secreto tecnológico y guerra en Bizancio.</p>

<p>La lógica de fondo es simple: si menos personas conocen los detalles de una tarea, se reduce la probabilidad de que esa información se vea comprometida o llegue al adversario. De ahí que existan distintos niveles de habilitación dentro de las organizaciones, e incluso con la habilitación más alta, cierta información compartimentada puede seguir restringida a determinados operadores.</p>

<p>Aplicado a OPSEC personal, es más robusto fragmentar y compartimentar la propia actividad en línea a través de múltiples identidades no vinculadas entre sí; tanto Ross Ulbricht como Hector Monsegur carecieron de esa compartimentación adecuada. Una estructura útil para entender dónde encaja la compartimentación dentro de OPSEC personal distingue cuatro grupos de contramedidas: sentido común y mentalidad de seguridad; conciencia del egocentrismo, el orgullo, la vanidad y la codicia; compartimentación mediante múltiples identidades; e implementación técnica. La compartimentación aparece como tercer pilar, después de la actitud y antes de la implementación técnica, no es "una herramienta más", sino una categoría de nivel superior a los controles técnicos.</p>

<p>El propio Manual OPSEC del Departamento de Defensa de EE.UU. añade un matiz relevante: al valorar una contramedida hay que evaluar también la posibilidad de que la propia contramedida cree un nuevo indicador de OPSEC, y la compartimentación mal ejecutada puede generar, en sí misma, un patrón detectable.</p>

<h3 id="tema-1.1.6-decisiones">Decisiones desde el minuto cero</h3>

<p><strong>Identidades separadas antes de operar.</strong> En el tradecraft clásico de espionaje, oficiales de caso de la CIA, "ilegales" de la KGB, la compartimentación de la actividad ilícita respecto a la vida normal empieza por una regla simple: no discutir esa actividad con nadie fuera del compartimento correspondiente. En comunidades de práctica más informales, esta misma lógica se describe con el vocabulario de "identidad burner": una identidad creada como escudo antes de cualquier momento de exposición, no como recurso improvisado durante o después de ella.</p>

<p><strong>Infraestructura aislada antes del primer uso.</strong> El envejecimiento de dominios es el ejemplo técnico más claro de "by design": los sistemas de reputación ponderan mucho la edad de un dominio, y esa antigüedad no puede fabricarse retroactivamente una vez iniciada la operación, por lo que la adquisición debe planificarse con semanas de antelación.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Idea — misma fuente que en el apartado anterior:</strong> el checklist "Red Team Checklist" de Red Team Guide (Joe Vest y James Tubberville), citado anteriormente, es también la fuente más sólida para este punto. Dentro de la fase de <strong>Planning</strong>, antes de la fase separada de <strong>Execution</strong>, enumera explícitamente "Threat Infrastructure": IPs, sistemas, redirectores y PPS organizados por nivel ("Tier"), con la instrucción de desplegar las herramientas a esa infraestructura. Es la confirmación, con autoría identificable y metodología real, de que la infraestructura de operación se diseña y despliega como fase de planificación separada, previa a cualquier acción activa contra el objetivo, no un descubrimiento independiente, sino el mismo documento aplicado aquí a un argumento distinto.</div>
</div>

<p><strong>Hábitos de comportamiento separados desde el principio.</strong> La compartimentación como hábito diario se resume en comunidades de práctica como no poner "todos los huevos de la identidad en la misma cesta": mantener separados el trabajo, la vida personal, los alias y las tareas desde el primer día, en vez de intentar separar después actividades que ya se mezclaron.</p>

<h3 id="tema-1.1.6-errores-parche">Errores típicos al "arreglar" OPSEC después de un fallo</h3>

<div class="table-wrapper">
<table>
<thead><tr><th>Error</th><th>Por qué no funciona</th></tr></thead>
<tbody>
<tr><td>Reutilizar una identidad parcialmente comprometida en vez de descartarla</td><td>Cambiar el alias sin cambiar el contexto (mismo dispositivo, mismo patrón de acceso) no rompe la cadena; la extiende — caso Ulbricht/"frosty"</td></tr>
<tr><td>Mezclar infraestructura antigua con nueva sin verificar el vínculo entre ambas</td><td>Reutilizar un componente (dominio, certificado, servidor) ya usado en una fase comprometida asume que basta con cambiar una sola pieza, cuando el vínculo puede sobrevivir en otro componente compartido</td></tr>
<tr><td>Registrar un dominio o identidad de última hora como "parche" antes de una operación</td><td>Un dominio comprado el mismo día del engagement se trata de forma distinta por los sistemas de reputación; el problema de fondo —falta de antigüedad— no se resuelve retroactivamente</td></tr>
</tbody>
</table>
</div>

<p>El patrón cognitivo de fondo, el modelo de "acumulación de errores", explica por qué el parche suele llegar tarde: para cuando alguien percibe la necesidad de "arreglar" su OPSEC, es probable que ya existan múltiples vínculos menores acumulados, no solo uno. Arreglar el vínculo más visible no elimina los demás que ya están dispersos en registros de terceros fuera del propio control.</p>

<h3 id="tema-1.1.6-aplicacion">Aplicación práctica: red team vs. OPSEC personal</h3>

<p><strong>Pentest/red team.</strong> El orden de fases del checklist ya citado es explícito: Rules of Engagement → perfiles de amenaza → infraestructura de amenaza (IPs, sistemas, redirectores, PPS por nivel) → despliegue de herramientas → solo entonces comienza la fase de Execution. La infraestructura no solo se prepara antes de actuar: se prepara con la antelación suficiente para adquirir propiedades, antigüedad, reputación, que no podrían lograrse preparándola sobre la marcha.</p>

<p>El diseño previo tampoco es gratuito: preparar infraestructura con semanas de antelación, dominios envejecidos, certificados, VPS ya en uso ligero, tiene un coste real en tiempo y dinero que no todos los engagements pueden permitirse. Existe una tensión legítima entre el rigor de OPSEC exigido y el presupuesto o los plazos acordados con el cliente; "by design" es un ideal a perseguir, no una opción sin coste que siempre esté disponible.</p>

<p><strong>OPSEC personal.</strong> El mismo principio de compartimentación se traduce en crear el compartimento, alias, correo, dispositivo o perfil de navegador separado, antes de la primera publicación, en vez de después de que la identidad real y la identidad protegida ya hayan compartido algún rastro común (IP, alias, estilo de escritura, hora de actividad). Una tarea concreta de "primer día", descrita en fuentes de comunidad, consiste en escribir el propio modelo de amenaza, qué se protege y de quién, y empezar a compartimentar separando la cuenta personal diaria de las identidades de pruebas o de trabajo.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Cuidado — la analogía cojea en un punto:</strong> en un red team, el diseño previo está respaldado por gobernanza institucional: un checklist de metodología, Rules of Engagement, un cliente que exige rigor. En OPSEC personal no existe un documento equivalente que imponga esa disciplina — la persona que actúa sola no tiene checklist, cliente ni auditoría externa que la obligue a planificar con semanas de antelación. Igualar ambos contextos sin este matiz da una falsa sensación de que "diseñar desde el minuto cero" es igual de exigible en ambos casos, cuando en la práctica solo uno de los dos tiene un marco que lo hace cumplir.</div>
</div>

<h3 id="tema-1.1.6-fuentes">Fuentes de todo el tema 1.1</h3>

<p>Fuentes consultadas y citadas a lo largo de los apartados 1.1.1, 1.1.2, 1.1.3, 1.1.4, 1.1.5 y 1.1.6 de este tema.</p>

<p><strong>1.1.1 — ¿Qué es OPSEC? Más allá de las cinco fases clásicas</strong></p>
<ul class="concept-list">
<li><strong>NSDD-298</strong>, "National Operations Security Program", 22 enero 1988: <a href="https://irp.fas.org/offdocs/nsdd/nsdd-298.pdf">irp.fas.org/offdocs/nsdd/nsdd-298.pdf</a> y <a href="https://irp.fas.org/offdocs/nsdd298.htm">irp.fas.org/offdocs/nsdd298.htm</a></li>
<li><strong>Joint Publication 3-13.3</strong>, "Operations Security" (DoD), versiones 2006/2012: <a href="https://www.bits.de/NRANEU/others/jp-doctrine/JP3-13-3(12).pdf">bits.de/.../JP3-13-3(12).pdf</a> y <a href="https://publicintelligence.net/jcs-operations-security/">publicintelligence.net/jcs-operations-security</a></li>
<li><strong>ATP 3-13.3</strong>, "Army Operations Security for Division and Below", julio 2019: <a href="https://usacac.army.mil/Portals/1/Organizations/COE/MCCOE/FMPC/ATP_3-13_3_Army_Operations_Security_for_Division_and_Below.pdf">usacac.army.mil</a></li>
<li>NSA Center for Cryptologic History, <strong>"Purple Dragon: The Origin and Development of the United States OPSEC Program"</strong> (1993, desclasificado): <a href="https://archive.org/stream/purple_dragon-nsa/purple_dragon_djvu.txt">archive.org/stream/purple_dragon-nsa</a></li>
<li>SANS Institute, área Red Team / Offensive Operations: <a href="https://www.sans.org/cybersecurity-focus-areas/offensive-operations/red-team">sans.org</a></li>
<li>Red Team Guide (redteam.guide), sección "Definitions": <a href="https://redteam.guide/docs/definitions/">redteam.guide/docs/definitions</a></li>
<li>Hacktive Security, "Introduction to OPSEC (Part 2)": <a href="https://www.hacktivesecurity.com/blog/2025/09/02/introduction-to-opsec-part-2/">hacktivesecurity.com</a></li>
<li>The Register, "Opsec oversights: How cybercrooks get themselves caught" (jul. 2025)</li>
<li>CSO Online, "Opsec examples: 6 spectacular operational security failures" (jul. 2023)</li>
<li>CoinDesk, "Silk Road fell due to a catalogue of errors by owner Ross Ulbricht" (2013)</li>
<li>The Register, "The 'one tiny slip' that put LulzSec chief Sabu in the FBI's pocket" (2012)</li>
<li>F5 Labs, "Profile of a Hacker: The Real Sabu, Part 2" (2017)</li>
<li>BankInfoSecurity/DataBreachToday, "Poor Opsec Led to Spyware Developer's Downfall" / "No 'Invisible God': Fxmsp's Operational Security Failures"</li>
</ul>

<p><strong>1.1.2 — Las 5 fases clásicas de OPSEC</strong></p>
<ul class="concept-list">
<li>NIST/CSRC Glossary, "operations security (OPSEC)", vía CNSSI 4009-2015 y DoDD 5205.02E: <a href="https://csrc.nist.gov/glossary/term/operations_security">csrc.nist.gov/glossary/term/operations_security</a></li>
<li>NTTP 3-13.3M / MCTP 3-32B, "Operations Security" (Marina/Cuerpo de Marines de EE.UU., 2017): <a href="https://media.defense.gov/2020/Oct/28/2002524943/-1/-1/0/NTTP-3-13.3M-MCTP-3-32B-OPSEC-2017.PDF">media.defense.gov</a></li>
<li>CDSE (Center for Development of Security Excellence, DoD), guía de estudiante GS130, "OPSEC Awareness for Military Members, DoD Employees": <a href="https://www.cdse.edu/Portals/124/Documents/student-guides/GS130-guide.pdf">cdse.edu</a></li>
<li>TryHackMe, sala "Red Team OPSEC" / "Red Team Frameworks" — resúmenes y walkthroughs: <a href="https://medium.com/@jithuabhi414/red-team-opsec-walkthrough-key-takeaways-60f3ab256796">Medium</a>, <a href="https://github.com/jesusgavancho/TryHackMe_and_HackTheBox/blob/master/Red%20Team%20OPSEC.md">GitHub</a>, <a href="https://infoseccafe.com/uncategorized/tryhackme-red-team-opsec-write-up-summary/">InfoSecCafe</a>, <a href="https://motasem-notes.net/red-team-frameworks-opsec-tryhackme/">Motasem Notes</a></li>
<li>Hacktive Security, "Introduction to OPSEC (Part 1)": <a href="https://www.hacktivesecurity.com/blog/2025/01/21/introduction-to-opsec-part-1/">hacktivesecurity.com</a></li>
<li>Noorstream, "Top OPSEC Mistakes in Red Team Operations Explained": <a href="https://noorstream.com/2025/10/29/red-team-opsec-failures-lessons-from-real-operations-and-case-studies/">noorstream.com</a></li>
<li>Splunk, "What Is OPSEC? Operations Security and How It Works": <a href="https://www.splunk.com/en_us/blog/learn/opsec-operations-security.html">splunk.com</a></li>
<li>CSO Online, "What is OPSEC? How operations security protects critical information": <a href="https://www.csoonline.com/article/567199/what-is-opsec-a-process-for-protecting-critical-information.html">csoonline.com</a></li>
</ul>

<p><strong>1.1.3 — Diferencias entre OPSEC, INFOSEC, COMSEC y PERSEC</strong></p>
<ul class="concept-list">
<li>CNSSI No. 4009, "Committee on National Security Systems (CNSS) Glossary" (6 abril 2015): <a href="https://rmf.org/wp-content/uploads/2017/10/CNSSI-4009.pdf">rmf.org</a></li>
<li>NIST CSRC Glossary — "information security": <a href="https://csrc.nist.gov/glossary/term/information_security">csrc.nist.gov/glossary/term/information_security</a> e "INFOSEC": <a href="https://csrc.nist.gov/glossary/term/INFOSEC">csrc.nist.gov/glossary/term/INFOSEC</a></li>
<li>NIST CSRC Glossary — "communications security": <a href="https://csrc.nist.gov/glossary/term/communications_security">csrc.nist.gov/glossary/term/communications_security</a></li>
<li>44 U.S.C. §3542 (recodificado como §3552 tras FISMA 2014), base legal de "information security": <a href="https://www.govinfo.gov/content/pkg/USCODE-2008-title44/html/USCODE-2008-title44-chap35-subchapIII-sec3542.htm">govinfo.gov</a></li>
<li>Departamento de Comercio de EE.UU., páginas de programa COMSEC y "Personnel Security (PerSec)": <a href="https://www.commerce.gov/osy/programs/information-security/communications-security">commerce.gov/.../communications-security</a> y <a href="https://www.commerce.gov/osy/programs/personnel-security">commerce.gov/.../personnel-security</a> — 🔍 cita textual pendiente de verificación manual</li>
<li>Wikipedia (con fuentes primarias enlazadas), "Transmission security": <a href="https://en.wikipedia.org/wiki/Transmission_security">en.wikipedia.org/wiki/Transmission_security</a></li>
<li>Marine Parents / After The Corps, "PERSEC vs OPSEC": <a href="https://atc.marineparents.com/announcements/AnnouncementDetails.asp?ID=214">marineparents.com</a></li>
<li>MilitarySpot.com, "OPSEC and PERSEC": <a href="https://www.militaryspot.com/resources/opsec-and-persec">militaryspot.com</a></li>
<li>Urban Dictionary, entrada "PERSEC" (fuente informal, no normativa): <a href="https://www.urbandictionary.com/define.php?term=PERSEC">urbandictionary.com</a> — 🔍 cita textual pendiente de verificación manual</li>
<li>OT Security Hub, "OpSec vs InfoSec: What's the Difference?": <a href="https://otsecurityhub.com/information/opsec-vs-infosec-whats-the-difference/">otsecurityhub.com</a></li>
<li>IT Law Wiki, entrada "Information security" (incluye la definición histórica de INFOSEC como paraguas de PERSEC/COMSEC): <a href="https://itlaw.fandom.com/wiki/Information_security">itlaw.fandom.com/wiki/Information_security</a></li>
</ul>

<p><strong>1.1.4 — Por qué OPSEC no es anonimato — el modelo de capas de protección</strong></p>
<ul class="concept-list">
<li>U.S. Attorney's Office, District of Massachusetts, comunicado sobre Eldo Kim: <a href="https://www.justice.gov/usao-ma/pr/harvard-student-charged-making-hoax-bomb-threat">justice.gov/usao-ma</a></li>
<li>Forbes, "Harvard Student Receives F For Tor Failure While Sending 'Anonymous' Bomb Threat" (18 dic. 2013): <a href="https://www.forbes.com/sites/runasandvik/2013/12/18/harvard-student-receives-f-for-tor-failure-while-sending-anonymous-bomb-threat/">forbes.com</a></li>
<li>Harvard Crimson, cobertura del caso Kim con cita del afidávit del FBI (17 dic. 2013): <a href="https://www.thecrimson.com/article/2013/12/17/student-charged-bomb-threat/">thecrimson.com</a></li>
<li>Bruce Schneier, "Tor User Identified by FBI": <a href="https://www.schneier.com/blog/archives/2013/12/tor_user_identi.html">schneier.com</a></li>
<li>Scientific American, "McAfee's Rookie Mistake Gives Away His Location": <a href="https://www.scientificamerican.com/article/mcafees-rookie-mistake/">scientificamerican.com</a></li>
<li>NPR, "Betrayed By Metadata: John McAfee Admits He's Really In Guatemala": <a href="https://www.npr.org/sections/thetwo-way/2012/12/04/166487197/betrayed-by-metadata-john-mcafee-admits-hes-really-in-guatemala">npr.org</a></li>
<li>Graham Cluley, cobertura del caso McAfee y los metadatos EXIF: <a href="https://grahamcluley.com/john-mcafee-location-exif/">grahamcluley.com</a></li>
<li>U.S. Attorney's Office, SDNY, comunicados sobre arresto y extradición de Roger Thomas Clark: <a href="https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-arrest-and-unsealing-charges-against-senior-adviser">arresto</a> y <a href="https://www.justice.gov/usao-sdny/pr/manhattan-us-attorney-announces-extradition-senior-adviser-operator-silk-road-website">extradición</a></li>
<li>Hacktive Security, "Introduction to OPSEC (Part 2)" — modelo de acumulación de errores aplicado a Ulbricht: <a href="https://www.hacktivesecurity.com/blog/2025/09/02/introduction-to-opsec-part-2/">hacktivesecurity.com</a></li>
<li>Narayanan et al., paper IEEE S&P sobre desanonimización a escala de Internet mediante estilometría, resumido por el propio autor: <a href="https://33bits.wordpress.com/2012/02/20/is-writing-style-sufficient-to-deanonymize-material-posted-online/">33bits.wordpress.com</a></li>
<li>Paper sobre estilometría aplicada a foros de la dark web (ACM/Springer): <a href="https://dl.acm.org/doi/10.1007/978-3-319-50011-9_14">dl.acm.org</a></li>
<li>State of Surveillance, artículo divulgativo sobre estilometría (menciona el caso Rowling/Galbraith): <a href="https://stateofsurveillance.org/articles/technical/stylometry-writing-fingerprint-identification/">stateofsurveillance.org</a></li>
</ul>

<p><strong>1.1.5 — OPSEC ofensivo vs defensivo: el atacante también deja huella</strong></p>
<ul class="concept-list">
<li>MITRE ATT&CK, página oficial de recursos ("Get Started"): <a href="https://attack.mitre.org/resources/">attack.mitre.org/resources</a></li>
<li>TIBER-EU, framework oficial del Banco Central Europeo: <a href="https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/html/index.en.html">ecb.europa.eu/tiber-eu</a> y documentación en <a href="https://tiber-eu.fr/">tiber-eu.fr</a></li>
<li>David J. Bianco, "The Pyramid of Pain" (2013), entrada de blog original: <a href="https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html">detect-respond.blogspot.com</a> — 🔍 acceso directo pendiente de verificación manual</li>
<li>Red Team Guide, plantilla de Rules of Engagement: <a href="https://redteam.guide/docs/Templates/roe_template/">redteam.guide/docs/Templates/roe_template</a></li>
<li>Salesforce Engineering Blog, "TLS Fingerprinting with JA3 and JA3S" (incluye el caso real de pentesters detectados tras rotar infraestructura): <a href="https://engineering.salesforce.com/tls-fingerprinting-with-ja3-and-ja3s-247362855967/">engineering.salesforce.com</a></li>
<li>CTI Wiki, "Infrastructure Tracking: Fingerprinting with JA3 and JARM": <a href="https://cyberthreatintelligence.net/wiki/infrastructure-tracking-ja3-jarm">cyberthreatintelligence.net</a></li>
<li>Hive Security, "Cobalt Strike Detection & Hunting: A Defender's Playbook": <a href="https://hivesecurity.gitlab.io/blog/cobalt-strike-detection-hunting/">hivesecurity.gitlab.io</a></li>
<li>Vectra AI, "C2 Evasion Techniques: Understanding JA3/S Randomization" (menciona la investigación de Akamai sobre aleatorización de huellas): <a href="https://www.vectra.ai/blog/c2-evasion-techniques">vectra.ai</a> — 🔍 cifras de Akamai pendientes de verificación manual</li>
<li>Cobalt.io, "Red Team Rules of Engagement (RoE): A Comprehensive Checklist & Guide": <a href="https://www.cobalt.io/learning-center/red-team-rules-of-engagement-comprehensive-checklist">cobalt.io</a></li>
<li>ioSENTRIX, "What are the Rules of Engagement in Penetration Testing?": <a href="https://iosentrix.com/blog/rules-of-engagement-in-penetration-testing">iosentrix.com</a></li>
<li>Praetorian, "Red Team vs Penetration Testing: What's the Difference?": <a href="https://www.praetorian.com/security-101/red-team-vs-penetration-testing/">praetorian.com</a></li>
<li>"C2 Infrastructure OPSEC for Red Team Operations": <a href="https://cybersecpentesting.com/blog/c2-infrastructure-opsec.html">cybersecpentesting.com</a></li>
<li>DbgMan, "Red Team Infrastructure The Full Picture: From Domain to Beacon": <a href="https://0xdbgman.github.io/posts/red-team-infrastructure-the-full-picture/">0xdbgman.github.io</a></li>
<li>Parrot CTFs, "Red Team Infrastructure: Complete Guide to Setup and Best Practices in 2025": <a href="https://parrot-ctfs.com/blog/red-team-infrastructure-complete-guide-to-setup-and-best-practices-in-2025/">parrot-ctfs.com</a></li>
</ul>

<p><em>Nota:</em> varias de las fuentes de infraestructura de red team citadas arriba (blogs de comunidad y de marketing de servicios de pentest) documentan prácticas ampliamente extendidas, pero no constituyen un estándar normativo único — no existe, hasta la fecha, un documento equivalente a la NSDD-298 para la infraestructura ofensiva de red teaming.</p>

<p><strong>1.1.6 — OPSEC by design: desde el primer minuto, no como parche</strong></p>
<ul class="concept-list">
<li>Ann Cavoukian, "Privacy by Design: The 7 Foundational Principles" (documento original, agosto 2009, revisado enero 2011): <a href="https://www.sfu.ca/~palys/Cavoukian-2011-PrivacyByDesign-7FoundationalPrinciples.pdf">sfu.ca</a> y <a href="https://student.cs.uwaterloo.ca/~cs492/papers/7foundationalprinciples_longer.pdf">student.cs.uwaterloo.ca</a></li>
<li>Global Privacy and Security by Design Centre, resumen de los siete principios: <a href="https://gpsbydesigncentre.com/the-seven-foundational-principles/">gpsbydesigncentre.com</a></li>
<li>Wikipedia, "Compartmentalization (information security)", con nota histórica sobre el fuego griego: <a href="https://en.wikipedia.org/wiki/Compartmentalization_(information_security)">en.wikipedia.org/wiki/Compartmentalization_(information_security)</a></li>
<li>Alex Roland, "Secrecy, Technology, and War: Greek Fire and the Defense of Byzantium", <em>Technology and Culture</em>, vol. 33, n.º 4 (1992), pp. 655-679 — fuente académica primaria del origen histórico de la compartimentación</li>
<li>IVPN, "Online Privacy Through OPSEC and Compartmentalization: Part 4" (cita explícita de los casos Ulbricht y Monsegur como fallos de compartimentación, y referencia al Manual OPSEC del DoD): <a href="https://www.ivpn.net/privacy-guides/online-privacy-through-opsec-and-compartmentalization-part-4/">ivpn.net</a></li>
<li>Red Team Guide (Joe Vest y James Tubberville), "Red Team Checklist": <a href="https://redteam.guide/docs/checklists/red-team-checklist/">redteam.guide/docs/checklists/red-team-checklist</a></li>
<li>Cybersecurity Switzerland, guía de preparación de red team (cifras de CREST/SANS citadas indirectamente): <a href="https://cybersecurityswitzerland.com/guides/preparing-for-red-team-assessment/">cybersecurityswitzerland.com</a> — 🔍 cifras pendientes de verificación manual contra el informe primario de CREST/SANS</li>
</ul>

<p><em>Nota:</em> los casos de Ross Ulbricht y Hector Monsegur reutilizados en este apartado ya fueron verificados con fuentes primarias en 1.1.1; aquí se citan con el mismo respaldo, solo con un enfoque distinto (diseño previo vs. parche posterior).</p>

</div>
</section>