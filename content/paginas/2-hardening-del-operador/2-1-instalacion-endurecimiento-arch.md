---
title: "Instalación y endurecimiento de Arch Linux"
description: "Guía técnica para el ASUS Zenbook: decisiones cerradas, comandos ordenados y puntos críticos a respetar."
modulo_num: 2
tema_num: "2.99"
tema_titulo: "Instalación y endurecimiento de Arch Linux"
tema_desc: "Guía exhaustiva para endurecer un puesto de trabajo ofensivo basado en Arch Linux. Todas las decisiones técnicas están tomadas, los conflictos entre seguridad y usabilidad resueltos, y las excepciones documentadas para que sepas qué sacrificas y por qué. Se ha usado un ordenador portátil ASUS Zenbook para la prueba. El uso de otro modelo puede variar mínimamente algunos de los comandos usados."
weight: 202
accent: "#FF6B4D"
accent_dim: "rgba(255, 107, 77, 0.08)"
accent_glow: "rgba(255, 107, 77, 0.25)"
etiqueta: EXTRA
subtemas:
  - anchor: "tema-2.99.3"
    label: "2.99.3 Firmware ASUS"
---

<section class="tema-section" id="tema-2.99.1">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.1</span> Lo que conseguirás al final de esta guía
</h2>
<div class="tema-content">

<p>Cuando termines, tu portátil será esto:</p>

<ul>
<li>Un sistema que <strong>solo arranca con lo que tú has firmado</strong>: Secure Boot con claves propias, nada de bootkits ni firmas de terceros.</li>
<li>Un disco <strong>completamente cifrado</strong>, con el TPM sellado y un PIN para el desbloqueo; si te lo roban apagado, los datos no se leen.</li>
<li><strong>Apagado automático al cerrar la tapa</strong>: ni suspensión ni hibernación que dejen la clave en RAM.</li>
<li><strong>Lockdown del kernel en modo integridad</strong>: ni siquiera root puede modificar el kernel en caliente.</li>
<li><strong>Firewall con política DROP</strong> en entrada, sin puertos abiertos, y con reglas que no rompen tus VMs ni contenedores.</li>
<li><strong>Podman rootless</strong> en lugar de Docker, sin demonio privilegiado, sin reglas de firewall saltadas.</li>
<li><strong>Herramientas ofensivas en una VM desechable</strong>: el host se mantiene limpio, y restauras el estado base en segundos.</li>
<li><strong>Logs sellados, auditoría y canarios</strong>: si alguien entra, te enteras, y si borra algo, lo sabes.</li>
<li><strong>Copias de seguridad cifradas y pruebas de restauración</strong>: no te quedas sin salida si el TPM falla o el disco se corrompe.</li>
<li>Un <strong>script de verificación final</strong> que comprueba todo esto en un solo comando.</li>
</ul>

<p>No es un sistema de usar y tirar. Es una máquina de trabajo ofensivo que no sacrifica la seguridad por la comodidad, pero tampoco se vuelve inservible por aplicar hardening a lo loco. Las excepciones están documentadas y justificadas.</p>

</div>
</section>

<section class="tema-section" id="tema-2.99.2">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.2</span> Decisiones cerradas
</h2>
<div class="tema-content">

<p>Estas son las decisiones que definen la instalación. Son elecciones de configuración y uso, no características del hardware. Si alguna no encaja con tu forma de trabajar, es mejor que lo sepas antes de continuar.</p>

<ul class="step-list">
<li><strong>Kernel:</strong> <code>linux-hardened</code> como kernel principal y <code>linux</code> como respaldo. Ambos firmados para Secure Boot.</li>
<li><strong>Secure Boot:</strong> claves propias generadas con <code>sbctl</code>, con posibilidad de añadir certificados de Microsoft para compatibilidad con el firmware.</li>
<li><strong>TPM:</strong> desbloqueo de LUKS sellado a PCR 7, con PIN adicional obligatorio.</li>
<li><strong>Cifrado:</strong> disco completo con LUKS2, sin swap en disco. La swap va en zram dentro de la RAM.</li>
<li><strong>Al cerrar la tapa:</strong> apagado completo. Sin suspensión ni hibernación.</li>
<li><strong>Escritorio:</strong> GNOME sobre Wayland, con la sesión de X11 deshabilitada.</li>
<li><strong>Red:</strong> solo Wi-Fi, gestionado con <code>iwd</code>. Sin servicios de red accesibles desde el exterior.</li>
<li><strong>SSH entrante:</strong> no se instala. No hay ningún servicio escuchando en la red.</li>
<li><strong>Virtualización:</strong> KVM con libvirt para las máquinas virtuales. Módulos firmados y compatibles con lockdown.</li>
<li><strong>Contenedores:</strong> Podman en modo rootless. Docker queda descartado por su demonio privilegiado y su gestión del firewall.</li>
<li><strong>Herramientas ofensivas:</strong> se ejecutan en una VM dedicada, nunca en el host. El host se mantiene limpio y actualizable.</li>
<li><strong>Compilación:</strong> no se instala <code>base-devel</code> en el host. Las compilaciones puntuales se hacen en un contenedor desechable.</li>
<li><strong>Firewall:</strong> nftables con política DROP en entrada y reglas explícitas para las redes internas de VMs y contenedores.</li>
<li><strong>AppArmor:</strong> activo y con perfiles en modo enforce para las aplicaciones con más exposición.</li>
<li><strong>Auditoría:</strong> auditd con reglas de integridad y canarios para detectar accesos no autorizados.</li>
<li><strong>Copias de seguridad:</strong> cifradas con Borg y almacenadas fuera del equipo. La restauración se prueba trimestralmente.</li>
</ul>

<p>Estas decisiones implican renuncias concretas. Son intencionadas y están documentadas para que sepas qué estás sacrificando:</p>

<ul class="step-list">
<li><strong>Sin suspensión:</strong> al cerrar la tapa el equipo se apaga. No hay suspensión a RAM ni hibernación, por lo que se pierde la capacidad de reanudar el trabajo instantáneamente.</li>
<li><strong>Sin drivers propietarios ni módulos DKMS:</strong> el kernel firmado y el lockdown impiden cargar módulos no firmados. Los drivers de NVIDIA o módulos de terceros que requieran DKMS no funcionarán.</li>
<li><strong>Sin compilación directa en el host:</strong> no se instala <code>base-devel</code> ni <code>gcc</code> en el sistema principal. Cualquier compilación debe realizarse dentro de un contenedor desechable.</li>
</ul>

<p>Si necesitas alguna de estas capacidades, existen alternativas documentadas en los bloques correspondientes: usar una máquina virtual, un contenedor de compilación o reconfigurar el arranque con otra política de suspensión (asumiendo los riesgos).</p>

</div>
</section>

<section class="tema-section" id="tema-2.99.3">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.3</span> Firmware ASUS
</h2>
<div class="tema-content">

<p>Este bloque actualiza el firmware del equipo y deja la configuración UEFI preparada para todo lo que viene después. Es un paso previo obligatorio: sin él, Secure Boot, el TPM y la virtualización no funcionarán como se espera.</p>

<p>El firmware de fábrica suele estar desactualizado y puede arrastrar vulnerabilidades de microcódigo. Una forma rápida de comprobarlo es ejecutar, desde cualquier Linux live:</p>

{{< code bash >}}
cat /sys/devices/system/cpu/vulnerabilities/tsa
{{< /code >}}

<p>Si aparece <code>Vulnerable: No microcode</code>, el sistema no está aplicando las correcciones más recientes para <em>Transient Scheduler Attacks</em> (TSA), una familia de fallos de canal lateral de AMD. La solución tiene dos partes: actualizar el firmware y cargar el microcódigo adecuado, que se instalará más adelante con el paquete <code>amd-ucode</code>.</p>

<h3 id="tema-2.99.3-1">3.1 Actualizar el firmware</h3>

<p>Hay dos vías para actualizar el firmware. Prueba primero la automática:</p>

<ol>
<li><p>Desde un sistema Linux con acceso a internet, instala <code>fwupd</code> y consulta las actualizaciones disponibles:</p>

{{< code bash >}}
sudo apt install fwupd
sudo fwupdmgr refresh --force
sudo fwupdmgr get-updates
{{< /code >}}
</li>

<li><p>Si no aparece ninguna actualización, ve a la web de soporte del fabricante, busca el modelo del equipo, y descarga la versión más reciente del firmware.</p></li>

<li><p>Descomprime el archivo descargado y copia el fichero de firmware a un USB formateado en FAT32.</p></li>

<li><p>Reinicia y pulsa <strong>ESC</strong> para entrar en la configuración UEFI.</p></li>

<li><p>Activa el modo avanzado con <strong>F7</strong>, ve a la pestaña <strong>Advanced</strong> y selecciona la utilidad de actualización de firmware (habitualmente llamada <strong>EZ Flash</strong> en equipos ASUS).</p></li>

<li><p>Selecciona el fichero del USB. No apagues el equipo durante el proceso, se reiniciará solo varias veces.</p></li>

<li><p>Al terminar, entra de nuevo en la UEFI y confirma que la versión instalada es la nueva.</p></li>
</ol>

<h3 id="tema-2.99.3-2">3.2 Configurar el UEFI</h3>

<p>Reinicia y entra otra vez con <strong>ESC</strong> y <strong>F7</strong>. Aplica los siguientes ajustes en este orden:</p>

<table class="table-wrapper">
<thead><tr><th>Ubicación</th><th>Ajuste</th><th>Valor</th><th>Motivo</th></tr></thead>
<tbody>
<tr><td>Advanced</td><td><strong>SVM Mode</strong></td><td><strong>Enabled</strong></td><td>Activa la virtualización por hardware para KVM</td></tr>
<tr><td>Advanced</td><td><strong>Trusted Computing → Security Device Support</strong></td><td><strong>Enabled</strong></td><td>Habilita el fTPM, necesario para el sellado</td></tr>
<tr><td>Advanced</td><td><strong>Trusted Computing → Pending Operation</strong></td><td><strong>TPM Clear</strong></td><td>Deja el TPM en estado limpio antes de usarlo</td></tr>
<tr><td>Advanced</td><td><strong>Network Stack Configuration → Network Stack</strong></td><td><strong>Disabled</strong></td><td>Reduce superficie de ataque en el arranque</td></tr>
<tr><td>Advanced</td><td><strong>USB Configuration → USB Mass Storage Driver Support</strong></td><td><strong>Enabled</strong> <em>por ahora</em></td><td>Necesario para arrancar desde USB; se desactiva al final</td></tr>
<tr><td>Boot</td><td><strong>Fast Boot</strong></td><td><strong>Disabled</strong></td><td>Evita que el firmware se salte pasos de arranque y mantiene estables las entradas EFI</td></tr>
<tr><td>Security</td><td><strong>Secure Boot</strong></td><td><strong>Disabled</strong> <em>por ahora</em></td><td>Se activará después de firmar los binarios</td></tr>
<tr><td>Security</td><td><strong>USB Interface Security → Bluetooth</strong></td><td><strong>LOCK</strong></td><td>Desactiva el Bluetooth. Si lo necesitas para raton/teclado dejalo activado.</td></tr>
<tr><td>Security</td><td><strong>USB Interface Security → CMOS Camera</strong></td><td><strong>LOCK</strong></td><td>Desactiva la cámara integrada</td></tr>
<tr><td>Security</td><td><strong>Administrator Password</strong></td><td><strong>Establécela al final de esta configuración</strong></td><td>Protege la configuración UEFI</td></tr>
</tbody>
</table>

<p>Mantén activo el arranque desde USB. Lo desactivaremos al final de la guía.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Establece la contraseña de administrador al final de esta configuración UEFI.</strong> En algunos equipos, una vez puesta, el menú de gestión de claves queda en modo solo lectura y obliga a resetear la NVRAM para recuperar el control. Además, en este modelo concreto, es posible que el submenú <strong>Key Management</strong> solo aparezca después de poner la contraseña.</div>
</div>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Sobre el fTPM de AMD:</strong> es firmware, no un chip dedicado. Un <em>Clear CMOS</em> o ciertas actualizaciones de AGESA pueden resetearlo y provocar la pérdida del sellado. Por eso la clave de recuperación no es opcional. Algunas versiones antiguas de AGESA también causaban microcortes de audio o del puntero; si aparecen tras actualizar, es un síntoma conocido.</div>
</div>

<h3 id="tema-2.99.3-3">3.3 Comprobación</h3>

<p>Arranca desde el USB de Arch y ejecuta estas verificaciones:</p>

{{< code bash >}}
(iso)# ls /sys/firmware/efi/efivars                 # debe aparecer una lista
(iso)# ls /dev/tpmrm0                               # debe aparecer una linea
(iso)# ls /sys/kernel/iommu_groups | wc -l          # debe ser mayor que 0
(iso)# bootctl status | grep -i "secure boot"       # debe mostrar setup o disabled
(iso)# grep -c svm /proc/cpuinfo                    # debe ser mayor que 0
(iso)# cat /sys/devices/system/cpu/vulnerabilities/tsa
{{< /code >}}

<p>Qué comprueba cada comando:</p>

<ul class="step-list">
<li><code><strong>ls /sys/firmware/efi/efivars</strong></code>: lista las variables EFI del firmware. Si el directorio existe y tiene contenido, el sistema ha arrancado en modo UEFI nativo y no en modo legacy (BIOS). Sin esto, Secure Boot no es posible.</li>
<li><code><strong>ls /dev/tpmrm0</strong></code>: comprueba si el TPM 2.0 está detectado y expuesto como dispositivo de acceso. Si aparece una línea con ese nombre, el fTPM está activo y el sellado de LUKS podrá funcionar más adelante.</li>
<li><code><strong>ls /sys/kernel/iommu_groups | wc -l</strong></code>: cuenta los grupos IOMMU que el kernel ha detectado. Un número mayor que cero indica que el IOMMU está activo y que se podrá aislar dispositivos DMA, tanto para seguridad como para pasar hardware a una VM.</li>
<li><code><strong>bootctl status | grep -i "secure boot"</strong></code>: consulta el estado de Secure Boot según systemd-boot y filtra solo la línea relevante. En este punto debería decir <code>setup</code> (modo configuración) o <code>disabled</code>, porque todavía no hemos firmado nada ni activado Secure Boot.</li>
<li><code><strong>grep -c svm /proc/cpuinfo</strong></code>: busca cuántas veces aparece la cadena <code>svm</code> en la información del procesador. SVM (Secure Virtual Machine) es el nombre que AMD da a su extensión de virtualización por hardware; un número mayor que cero confirma que está habilitada en BIOS.</li>
<li><code><strong>cat /sys/devices/system/cpu/vulnerabilities/tsa</strong></code>: lee el estado de mitigación para la vulnerabilidad TSA (Transient Scheduler Attacks). Si dice <code><strong>Vulnerable: No microcode</strong></code>, falta actualizar firmware o cargar microcódigo; si dice <code><strong>Mitigation: Clear CPU buffers</strong></code>, el kernel ya está aplicando la mitigación completa.</li>
</ul>
</div>
</section>

<section class="tema-section" id="tema-2.99.4">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.4</span> Verificar el medio de instalación
</h2>
<div class="tema-content">

<p>Antes de escribir la ISO en el USB conviene verificar que la descarga es íntegra y auténtica. Una ISO corrupta puede provocar fallos difíciles de diagnosticar durante la instalación; una ISO manipulada es un vector de ataque real. La verificación tiene dos partes: comprobar el hash SHA256 para descartar corrupción, y verificar la firma GPG para confirmar que el archivo procede de Arch Linux y no ha sido alterado.</p>

<h3 id="tema-2.99.4-1">4.1 Descargar la ISO y los archivos de verificación</h3>

<p>Desde un sistema Linux con conexión a internet, descarga los tres archivos necesarios:</p>

{{< code bash >}}
curl -O https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso
curl -O https://archlinux.org/iso/latest/archlinux-x86_64.iso.sig
curl -O https://archlinux.org/iso/latest/sha256sums.txt
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>curl -O</code>: descarga un archivo desde una URL y lo guarda con el mismo nombre que tiene en el servidor. La opción <code>-O</code> (mayúscula) es la que fuerza el nombre original; sin ella, el contenido se imprimiría en la terminal.</li>
<li>La primera URL apunta a un mirror de Arch; las otras dos, al servidor oficial, que es donde se publican la firma y las sumas de verificación.</li>
</ul>

<h3 id="tema-2.99.4-2">4.2 Verificar la integridad</h3>

<p>Comprueba que el hash de la ISO descargada coincide con el publicado:</p>

{{< code bash >}}
sha256sum -c sha256sums.txt --ignore-missing
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sha256sum -c</code>: modo "check". Lee el archivo de sumas y, para cada entrada, calcula el hash del archivo correspondiente y lo compara con el valor publicado.</li>
<li><code>--ignore-missing</code>: si el archivo de sumas incluye entradas para ISOs que no has descargado, las omite en lugar de marcar error. Solo se verifica lo que tienes en disco.</li>
</ul>

<p>Debe aparecer <code>archlinux-x86_64.iso: OK</code>. Si el resultado es <code>FAILED</code>, la descarga está corrupta o ha sido manipulada; vuelve a descargarla desde otro mirror.</p>

<h3 id="tema-2.99.4-3">4.3 Verificar la autenticidad</h3>

<p>El hash confirma integridad, pero no autenticidad: alguien que controle el mirror podría publicar una ISO modificada junto con su hash correspondiente. Para descartarlo, se verifica la firma GPG contra la clave del desarrollador que firmó la release.</p>

{{< code bash >}}
gpg --auto-key-locate clear,wkd --locate-external-key pierre@archlinux.org
gpg --verify archlinux-x86_64.iso.sig archlinux-x86_64.iso
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>gpg --auto-key-locate clear,wkd --locate-external-key</code>: busca y descarga automáticamente la clave pública asociada a un correo. <code>clear</code> indica que se use el servidor de claves directo si está disponible; <code>wkd</code> (Web Key Directory) permite que la clave se obtenga desde el dominio del correo. Es una forma de no tener que importar la clave manualmente.</li>
<li><code>gpg --verify</code>: comprueba que la firma del archivo <code>.sig</code> corresponde realmente a la ISO descargada y que fue emitida por la clave privada del desarrollador. Si la ISO hubiera sido modificada, la firma no validaría.</li>
</ul>

<p>La salida debe incluir <code>Good signature from "Pierre Schmitz"</code>. Un aviso de "clave no certificada" es normal si no has firmado la clave del desarrollador con tu propia clave; lo que no es aceptable es un <code>BAD signature</code>.</p>

<h3 id="tema-2.99.4-4">4.4 Escribir la ISO al USB</h3>

<p>Con la ISO verificada, escríbela al dispositivo USB. Asegúrate de identificar correctamente el dispositivo para no sobrescribir el disco del sistema:</p>

{{< code bash >}}
lsblk
sudo dd if=archlinux-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>lsblk</code>: lista los dispositivos de bloque conectados (discos, particiones, USB). Sirve para identificar qué nombre tiene tu USB antes de escribir sobre él.</li>
<li><code>dd if=</code>: especifica el archivo de entrada; aquí, la ISO.</li>
<li><code>of=</code>: especifica el dispositivo de salida; aquí, el USB. <strong>Este es el parámetro crítico</strong>: si pones por error el disco principal, lo destruyes.</li>
<li><code>bs=4M</code>: tamaño de bloque. 4 MB es un buen equilibrio entre velocidad y uso de memoria.</li>
<li><code>status=progress</code>: muestra por pantalla el progreso de la escritura, en lugar de quedarse en silencio hasta terminar.</li>
<li><code>oflag=sync</code>: fuerza a que los datos se escriban físicamente en el dispositivo antes de dar la operación por terminada. Sin esto, podrías extraer el USB antes de que se complete la escritura real.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Verifica el dispositivo antes de ejecutar <code>dd</code>.</strong> Un error en la ruta de <code>of=</code> destruye el disco que escribas sin posibilidad de recuperación. Comprueba con <code>lsblk</code> que <code>/dev/sdX</code> es realmente el USB y no tu disco principal.</div>
</div>

</div>
</section>
<section class="tema-section" id="tema-2.99.5">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.5</span> Arranque live y conexión de red
</h2>
<div class="tema-content">

<p>Con la ISO verificada y el USB preparado, el siguiente paso es arrancar el sistema live de Arch y establecer conexión a internet. Sin red no es posible instalar: <code>pacstrap</code> descarga los paquetes desde los repositorios oficiales.</p>

<p>Este equipo no tiene puerto Ethernet, así que la conexión se hace obligatoriamente por Wi-Fi. Si en tu caso dispones de Ethernet, puedes saltarte la parte del cliente Wi-Fi y conectar el cable directamente.</p>

<h3 id="tema-2.99.5-1">5.1 Arrancar desde el USB</h3>

<p>Apaga el equipo, conecta el USB y enciéndelo pulsando la tecla de menú de arranque (habitualmente <strong>ESC</strong> o <strong>F11</strong> en equipos ASUS). Selecciona el USB en la lista de dispositivos de arranque.</p>

<p>Cuando aparezca el menú de systemd-boot del live, selecciona la primera entrada (arranque normal). Transcurridos unos segundos llegarás a un prompt de root con el identificador <code>root@archiso</code>.</p>

<h3 id="tema-2.99.5-2">5.2 Configurar el teclado</h3>

<p>El live arranca con la distribución de teclado en inglés. Si vas a escribir contraseñas con caracteres propios del español (ñ, acentos, símbolos como <code>¿</code>), cámbiala antes de nada:</p>

{{< code bash >}}
loadkeys es
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>loadkeys es</code>: carga la distribución de teclado española en la consola actual. Se aplica solo a la sesión de terminal en la que se ejecuta, no es persistente. Si el live se reinicia, hay que repetirlo.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Verificación rápida:</strong> después de cargar el teclado español, escribe <code>ñ</code> y comprueba que aparece correctamente. Si sale un carácter distinto, la distribución no se ha aplicado; revisa que no haya un error tipográfico en el nombre (<code>es</code>, no <code>esp</code> ni <code>spanish</code>).</div>
</div>

<h3 id="tema-2.99.5-3">5.3 Conectar por Wi-Fi con iwd</h3>

<p>El live de Arch incluye <code>iwd</code> (iNet Wireless Daemon) como cliente Wi-Fi. Es más ligero y moderno que <code>wpa_supplicant</code>, y es el mismo que usaremos después en el sistema instalado, así que conviene familiarizarse con él desde ahora.</p>

<p>Inicia el modo interactivo de iwd:</p>

{{< code bash >}}
iwctl
{{< /code >}}

<p>Dentro del prompt de iwd ejecuta los siguientes comandos en orden:</p>

{{< code bash >}}
[iwd]# device list
[iwd]# station wlan0 scan
[iwd]# station wlan0 get-networks
[iwd]# station wlan0 connect NOMBRE_DE_TU_RED
[iwd]# exit
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>device list</code>: muestra las interfaces de red inalámbricas detectadas. Lo habitual es que aparezca como <code>wlan0</code>, pero podría ser otro nombre.</li>
<li><code>station wlan0 scan</code>: ordena a la interfaz <code>wlan0</code> que escanee las redes Wi-Fi disponibles en el entorno. El escaneo puede tardar unos segundos.</li>
<li><code>station wlan0 get-networks</code>: lista las redes detectadas por el escaneo anterior, con su SSID y nivel de señal.</li>
<li><code>station wlan0 connect NOMBRE_DE_TU_RED</code>: inicia la conexión a la red indicada. Si la red usa cifrado WPA2 o WPA3, pedirá la contraseña de forma interactiva.</li>
<li><code>exit</code>: sale del cliente iwd y vuelve al shell normal del live.</li>
</ul>

<p>Alternativa en una sola línea, sin entrar en el modo interactivo:</p>

{{< code bash >}}
iwctl station wlan0 connect NOMBRE_DE_TU_RED
{{< /code >}}

<h3 id="tema-2.99.5-4">5.4 Verificar la conexión</h3>

<p>Antes de continuar, confirma que hay conectividad real hacia el exterior:</p>

{{< code bash >}}
ping -c3 archlinux.org
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>ping</code>: envía paquetes ICMP a un destino para comprobar si hay conectividad. Es la prueba más básica de "¿hay internet?".</li>
<li><code>-c3</code>: envía solo 3 paquetes y termina. Sin esta opción, <code>ping</code> se queda en ejecución indefinidamente.</li>
</ul>

<p>La salida debe mostrar líneas con tiempos de respuesta (<code>time=XX ms</code>) y terminar con un resumen. Si todas las peticiones se pierden, la red no está bien configurada: revisa el SSID, la contraseña y que el adaptador Wi-Fi esté detectado.</p>

<h3 id="tema-2.99.5-5">5.5 Sincronizar el reloj del sistema</h3>

<p>Arch verifica las firmas GPG de los paquetes durante la instalación. Si el reloj del sistema está muy desviado, las firmas aparecerán como inválidas y la instalación fallará con errores criptográficos difíciles de interpretar. Sincroniza el reloj antes de continuar:</p>

{{< code bash >}}
timedatectl set-ntp true
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>timedatectl set-ntp true</code>: activa la sincronización automática del reloj mediante NTP (Network Time Protocol). El sistema consulta servidores de tiempo públicos y ajusta la hora local. En el live se aplica solo durante la sesión, pero el sistema instalado conservará esta configuración si dejamos el servicio habilitado.</li>
</ul>

<p>Verifica que la hora es correcta:</p>

{{< code bash >}}
timedatectl status
{{< /code >}}

<h3 id="tema-2.99.5-6">5.6 Si la interfaz Wi-Fi no aparece</h3>

<p>Si el comando <code>device list</code> dentro de iwd no muestra ninguna interfaz inalámbrica, o si <code>station wlan0 scan</code> devuelve error, comprueba lo siguiente:</p>

{{< code bash >}}
dmesg | grep -i iwlwifi
rfkill list
rfkill unblock all
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>dmesg | grep -i iwlwifi</code>: busca en el registro del kernel las líneas relacionadas con el driver <code>iwlwifi</code>, que es el que gobierna los adaptadores Intel. Si no hay ninguna línea, el kernel no ha detectado el hardware.</li>
<li><code>rfkill list</code>: muestra el estado de los bloqueos por software y hardware de los dispositivos de radio (Wi-Fi, Bluetooth). Si alguna línea aparece como <code>Soft blocked: yes</code>, el Wi-Fi está bloqueado por software.</li>
<li><code>rfkill unblock all</code>: desbloquea todos los dispositivos de radio. Es lo habitual cuando el Wi-Fi aparece como bloqueado en un equipo nuevo o tras haber estado deshabilitado en Windows o en otra distribución.</li>
</ul>

<p>Si tras desbloquear sigue sin aparecer la interfaz, comprueba que la BIOS no tiene deshabilitado el adaptador Wi-Fi. En algunos equipos ASUS, la opción <strong>Wireless Network Interface</strong> dentro de <strong>I/O Interface Security</strong> controla si el Wi-Fi está activo a nivel de firmware.</p>

</div>
</section>

<section class="tema-section" id="tema-2.99.6">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.6</span> Particionado, cifrado y subvolúmenes
</h2>
<div class="tema-content">

<p>Este es el punto de no retorno de la instalación. Se van a borrar todas las particiones del disco y se va a crear desde cero la estructura sobre la que vivirá el sistema: una partición EFI, un volumen cifrado con LUKS2 que ocupa el resto del disco, y dentro de él varios subvolúmenes Btrfs con opciones de montaje restrictivas.</p>

<div class="callout callout-danger">
<span class="callout-icon">🚨</span>
<div class="callout-body"><strong>Este paso destruye todos los datos del disco seleccionado sin posibilidad de recuperación.</strong> Comprueba dos veces que trabajas sobre el disco correcto antes de ejecutar cualquier comando. Si tienes dudas sobre cuál es el nombre del disco, ejecuta <code>lsblk</code> y revisa tamaños y modelos.</div>
</div>

<h3 id="tema-2.99.6-1">6.1 Variables de trabajo</h3>

<p>Para no repetir rutas largas en cada comando, defínelas como variables de shell en la sesión actual:</p>

{{< code bash >}}
DISK=/dev/nvme0n1
ESP=/dev/nvme0n1p1
LUKSPART=/dev/nvme0n1p2
{{< /code >}}

<p>Qué hace cada una:</p>

<ul class="step-list">
<li><code>DISK</code>: ruta del disco completo. En un equipo con NVMe es <code>/dev/nvme0n1</code>; en un disco SATA sería <code>/dev/sda</code>.</li>
<li><code>ESP</code>: primera partición, donde irá la partición EFI.</li>
<li><code>LUKSPART</code>: segunda partición, que albergará el volumen cifrado.</li>
</ul>

<p>Las variables solo existen en la sesión de shell actual. Si cierras la terminal o reinicias, hay que volver a definirlas.</p>

<h3 id="tema-2.99.6-2">6.2 Borrado previo del disco</h3>

<p>Antes de crear la nueva estructura, conviene dejar el disco limpio. En un NVMe, el comando <code>blkdiscard</code> ordena al propio controlador que descarte todos los bloques, lo cual es rápido y suficiente para dejarlo preparado:</p>

{{< code bash >}}
blkdiscard $DISK
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>blkdiscard</code>: envía la orden TRIM/DISCARD al dispositivo, indicando al controlador que todos los bloques están libres. No escribe ceros; simplemente le dice al disco que olvide lo que había. En NVMe es instantáneo.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Alternativa paranoica:</strong> si quieres garantizar que los datos anteriores no son recuperables ni siquiera con herramientas forenses, puedes sobrescribir todo el disco con datos aleatorios. Es mucho más lento y en un SSD no aporta ventajas frente al borrado por TRIM. Se haría así:
{{< code bash >}}
cryptsetup open --type plain -d /dev/urandom $DISK tmpwipe
dd if=/dev/zero of=/dev/mapper/tmpwipe bs=1M status=progress
cryptsetup close tmpwipe
{{< /code >}}
</div>
</div>

<h3 id="tema-2.99.6-3">6.3 Crear las particiones</h3>

<p>La estructura es simple: una partición EFI de 1 GiB y una segunda partición que ocupa el resto del disco para el volumen cifrado.</p>

{{< code bash >}}
sgdisk --zap-all $DISK
sgdisk -n 1:0:+1G -t 1:ef00 -c 1:"EFI System" $DISK
sgdisk -n 2:0:0 -t 2:8309 -c 2:"LUKS" $DISK
partprobe $DISK
lsblk $DISK
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>sgdisk --zap-all</code>: borra todas las tablas de particiones (MBR y GPT) del disco. Deja el disco como si acabara de salir de fábrica.</li>
<li><code>sgdisk -n 1:0:+1G</code>: crea la primera partición. El <code>0</code> indica que empiece en el primer bloque libre; <code>+1G</code> que tenga 1 GiB.</li>
<li><code>-t 1:ef00</code>: asigna a la partición 1 el tipo EFI System (código 0xEF00 en GPT). Es el tipo que espera el firmware para arrancar en modo UEFI.</li>
<li><code>-c 1:"EFI System"</code>: pone nombre a la partición, útil para identificarla después.</li>
<li><code>sgdisk -n 2:0:0</code>: crea la segunda partición desde el primer bloque libre hasta el final del disco (el segundo <code>0</code> significa "hasta el final").</li>
<li><code>-t 2:8309</code>: tipo Linux LUKS (código 8309). No es estrictamente necesario, pero ayuda a que otras herramientas reconozcan el contenido.</li>
<li><code>partprobe $DISK</code>: pide al kernel que relea la tabla de particiones, para que los nuevos dispositivos aparezcan en <code>/dev</code> sin reiniciar.</li>
<li><code>lsblk $DISK</code>: muestra el resultado para verificar que las dos particiones existen y tienen los tamaños esperados.</li>
</ul>

<p><strong>Por qué 1 GiB en la partición EFI.</strong> Muchas guías recomiendan 300 o 512 MiB, y es suficiente para una instalación típica. En este caso no: vamos a tener cuatro Unified Kernel Images (UKI) de unos 150 MiB cada una, más una copia de respaldo en <code>EFI/BOOT</code>. Con 300 MiB te quedarías sin espacio en la primera actualización del kernel, y eso con Secure Boot activo significa no arrancar.</p>

<h3 id="tema-2.99.6-4">6.4 Cifrar la partición con LUKS2</h3>

<p>La segunda partición va a contener un volumen LUKS2 que cifra todo lo que haya dentro. LUKS2 es el formato moderno, con soporte para Argon2id como función de derivación de claves, más resistente a ataques con GPU que los formatos anteriores.</p>

{{< code bash >}}
cryptsetup luksFormat \
    --type luks2 \
    --cipher aes-xts-plain64 \
    --key-size 512 \
    --hash sha512 \
    --pbkdf argon2id \
    --iter-time 5000 \
    --use-random \
    --verify-passphrase \
    $LUKSPART

    # Puedes escribirlo en una sola linea sin poner los \
    # aqui se usan para facilitar su lectura.
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>--type luks2</code>: usa el formato LUKS2 en lugar del antiguo LUKS1. Permite Argon2id como función de derivación y tokens como el de TPM, que usaremos más adelante.</li>
<li><code>--cipher aes-xts-plain64</code>: cifra con AES en modo XTS. Es el modo recomendado para discos completos.</li>
<li><code>--key-size 512</code>: clave de 512 bits, que en XTS se divide en dos claves de 256 bits (una para cifrar, otra para el tweak).</li>
<li><code>--hash sha512</code>: función de hash usada internamente para verificaciones de cabecera.</li>
<li><code>--pbkdf argon2id</code>: función de derivación de la contraseña. Argon2id está diseñado para resistir ataques con hardware especializado (GPU, ASIC).</li>
<li><code>--iter-time 5000</code>: calibra el coste de derivación para que tarde aproximadamente 5 segundos en el equipo. Eso frena ataques por fuerza bruta.</li>
<li><code>--use-random</code>: usa <code>/dev/random</code> como fuente de entropía. Más lento pero más seguro que <code>/dev/urandom</code>.</li>
<li><code>--verify-passphrase</code>: pide la contraseña dos veces, para evitar errores tipográficos al crearla.</li>
</ul>

<p>La contraseña que introduzcas ahora es la <strong>contraseña maestra de cifrado del disco</strong>. Es la clave de recuperación que usarás cuando el TPM pierda el sellado, algo que ocurrirá antes o después (por ejemplo, tras una actualización de firmware). Elige una contraseña larga y memorizable, y anótala también en papel.</p>

<p>Abre el volumen cifrado para poder trabajar sobre él:</p>

{{< code bash >}}
cryptsetup open $LUKSPART cryptroot
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>cryptsetup open</code>: descifra la cabecera y crea un dispositivo mapeado en <code>/dev/mapper/cryptroot</code> que expone el contenido descifrado al sistema. Todo lo que se escriba en <code>/dev/mapper/cryptroot</code> se cifrará automáticamente antes de llegar al disco físico.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Rendimiento:</strong> los procesadores modernos incluyen instrucciones AES-NI aceleradas por hardware. El cifrado completo del disco no introduce una penalización perceptible en el uso diario. En un SSD NVMe la diferencia de rendimiento es insignificante.</div>
</div>

<h3 id="tema-2.99.6-5">6.5 Crear los sistemas de ficheros</h3>

<p>La partición EFI se formatea en FAT32 (obligatorio para que el firmware la reconozca), y el volumen descifrado se formatea en Btrfs:</p>

{{< code bash >}}
mkfs.fat -F32 -n ESP $ESP
mkfs.btrfs -L arch /dev/mapper/cryptroot
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>mkfs.fat -F32</code>: formatea en FAT32. El firmware UEFI solo entiende FAT32 en la partición EFI, sin excepciones.</li>
<li><code>-n ESP</code>: asigna la etiqueta "ESP" a la partición.</li>
<li><code>mkfs.btrfs -L arch</code>: crea un sistema de ficheros Btrfs con etiqueta "arch" sobre el volumen cifrado.</li>
</ul>

<h3 id="tema-2.99.6-6">6.6 Crear los subvolúmenes Btrfs</h3>

<p>Btrfs permite crear subvolúmenes dentro del mismo sistema de ficheros. Cada subvolumen es como una partición independiente a efectos de opciones de montaje, snapshots y organización, pero comparte el espacio total. Vamos a crear siete:</p>

{{< code bash >}}
mount /dev/mapper/cryptroot /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@var
btrfs subvolume create /mnt/@varlog
btrfs subvolume create /mnt/@snapshots
btrfs subvolume create /mnt/@containers
btrfs subvolume create /mnt/@libvirt
umount /mnt
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>mount</code>: monta el volumen Btrfs recién creado en <code>/mnt</code> para poder trabajar dentro de él.</li>
<li><code>btrfs subvolume create</code>: crea cada subvolumen en la raíz del sistema de ficheros. Los nombres que empiezan por <code>@</code> son una convención habitual en Arch para distinguir subvolúmenes de directorios normales.</li>
<li><code>umount /mnt</code>: desmonta el volumen para poder montarlo de nuevo con las opciones correctas.</li>
</ul>

<p>Para qué sirve cada subvolumen:</p>

<ul class="step-list">
<li><strong>@</strong>: raíz del sistema. Todo lo que no vaya a otro subvolumen vive aquí.</li>
<li><strong>@home</strong>: directorios personales. Separarlo permite hacer snapshots sin tocar los datos del sistema.</li>
<li><strong>@var</strong>: datos variables del sistema. Separado para no contaminar los snapshots de la raíz.</li>
<li><strong>@varlog</strong>: logs del sistema. Separado porque se monta con <code>noexec</code> y para poder conservar los logs aunque se restaure un snapshot de <code>@var</code>.</li>
<li><strong>@snapshots</strong>: ubicación de los snapshots. Fuera de la raíz para que un snapshot no contenga a sus propios snapshots.</li>
<li><strong>@containers</strong>: almacenamiento de Podman. Separado para poder darle opciones de montaje específicas.</li>
<li><strong>@libvirt</strong>: imágenes de máquinas virtuales. Separado por el mismo motivo.</li>
</ul>

<h3 id="tema-2.99.6-7">6.7 Montar los subvolúmenes con opciones restrictivas</h3>

<p>Ahora se montan todos los subvolúmenes en sus rutas definitivas, cada uno con opciones adaptadas a su función. Antes de montar los anidados hay que crear los puntos de montaje dentro del subvolumen que los contiene, porque un montaje oculta el contenido previo del directorio sobre el que se monta.</p>

{{< code bash >}}
OPTS=noatime,compress=zstd:1,ssd,discard=async

# 1. Montar la raiz y crear los puntos de montaje de primer nivel
mount -o $OPTS,subvol=@ /dev/mapper/cryptroot /mnt
mkdir -p /mnt/{home,var,efi,tmp}
mkdir -p /mnt/.snapshots

# 2. Montar @var temporalmente para crear dentro sus subdirectorios
mount -o $OPTS,subvol=@var /dev/mapper/cryptroot /mnt/var
mkdir -p /mnt/var/log
mkdir -p /mnt/var/lib/{containers,libvirt}
umount /mnt/var

# 3. Montar todos los subvolumenes en su sitio definitivo
mount -o $OPTS,subvol=@home,nosuid,nodev                    /dev/mapper/cryptroot /mnt/home
mount -o $OPTS,subvol=@var,nosuid,nodev                     /dev/mapper/cryptroot /mnt/var
mount -o $OPTS,subvol=@varlog,nosuid,nodev,noexec           /dev/mapper/cryptroot /mnt/var/log
mount -o $OPTS,subvol=@snapshots                            /dev/mapper/cryptroot /mnt/.snapshots
mount -o $OPTS,subvol=@containers,nodev                     /dev/mapper/cryptroot /mnt/var/lib/containers
mount -o noatime,subvol=@libvirt,nosuid,nodev               /dev/mapper/cryptroot /mnt/var/lib/libvirt

# 4. La particion EFI
mount -o umask=0077,shortname=winnt $ESP /mnt/efi

# 5. Desactivar CoW en el subvolumen de imagenes de VM
chattr +C /mnt/var/lib/libvirt
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>noatime</code>: no actualiza la fecha de último acceso de los ficheros cada vez que se leen. Reduce escrituras innecesarias y alarga la vida del SSD.</li>
<li><code>compress=zstd:1</code>: comprime los datos con zstd en nivel 1. El nivel 1 es el más rápido; el ahorro de espacio compensa sin sacrificar rendimiento.</li>
<li><code>ssd</code>: indica que el dispositivo es un SSD, activando optimizaciones específicas.</li>
<li><code>discard=async</code>: envía las operaciones TRIM de forma asíncrona, sin bloquear las escrituras.</li>
<li><code>nosuid</code>: ignora los bits SUID y SGID en los ficheros de ese subvolumen. Impide que un binario con SUID dentro del subvolumen pueda elevar privilegios.</li>
<li><code>nodev</code>: ignora los ficheros de dispositivo. Evita que un atacante cree un dispositivo dentro del subvolumen para acceder al hardware.</li>
<li><code>noexec</code>: impide ejecutar binarios desde ese subvolumen. Solo se aplica a <code>/var/log</code>, donde nada legítimo se ejecuta.</li>
<li><code>umask=0077</code>: en la partición EFI, restringe los permisos por defecto a solo el propietario.</li>
<li><code>shortname=winnt</code>: permite nombres de archivo 8.3 en la FAT32, por compatibilidad con el firmware.</li>
<li><code>chattr +C</code>: activa el atributo NOCOW en el directorio de libvirt. Los archivos nuevos creados dentro heredan el atributo y dejan de someterse a copy-on-write.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Por qué <code>@containers</code> lleva <code>nodev</code> pero no <code>nosuid</code>:</strong> las imágenes de contenedor incluyen binarios con SUID legítimos (por ejemplo <code>ping</code>, <code>su</code> o <code>sudo</code> dentro del contenedor). Si se monta con <code>nosuid</code>, esas imágenes fallan de forma difícil de diagnosticar. Se aísla la excepción en este subvolumen concreto en lugar de relajar <code>/home</code> entero.</div>
</div>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Sobre <code>@libvirt</code>: por qué NO se usa <code>nodatacow</code> como opción de montaje.</strong> En Btrfs, el control de copy-on-write no se hace con opciones de montaje sino con el atributo NOCOW a nivel de inodo. Poner <code>nodatacow</code> en el fstab afectaría a todo el sistema de ficheros, no solo a este subvolumen, porque en kernels modernos esa opción se aplica globalmente. La forma correcta es <code>chattr +C</code> sobre el directorio, que hace que los archivos nuevos hereden la propiedad sin afectar al resto del disco. Hay que aplicarlo antes de crear cualquier archivo dentro: si se hace después, los ya existentes conservan CoW.</div>
</div>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Por qué no hay <code>noexec</code> en <code>/home</code> ni en <code>/var</code>:</strong> rompería los scripts de Python y Bash que vayas a ejecutar. Es un antipatrón habitual aplicar <code>noexec</code> en <code>/home</code> sin pensar; aquí se evita deliberadamente.</div>
</div>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Por qué los puntos de montaje anidados se crean dentro del subvolumen contenedor:</strong> al montar un subvolumen sobre un directorio, todo el contenido previo de ese directorio queda oculto. Si se quiere montar <code>@varlog</code> en <code>/mnt/var/log</code>, el directorio <code>log</code> debe existir dentro de <code>@var</code>, no en <code>@</code>. Por eso se monta <code>@var</code> temporalmente, se crean dentro los subdirectorios necesarios y se desmonta antes del montaje definitivo.</div>
</div>

<section class="tema-section" id="tema-2.99.7">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.7</span> Instalación del sistema base
</h2>
<div class="tema-content">

<p>Con la estructura de disco preparada y los subvolúmenes montados, el siguiente paso es descargar e instalar el sistema base sobre <code>/mnt</code>. Este paso se hace con <code>pacstrap</code>, que es un script que se encarga de inicializar un sistema Arch mínimo desde los repositorios oficiales.</p>

<h3 id="tema-2.99.7-1">7.1 Configurar los mirrors</h3>

<p>Antes de instalar nada conviene actualizar la lista de mirrors. Por defecto, el live trae una lista enorme de servidores de todo el mundo; si se usa tal cual, <code>pacstrap</code> puede tardar mucho porque elige mirrors lentos. El comando <code>reflector</code> filtra por país, protocolo y velocidad, y deja la lista ordenada de más rápido a más lento:</p>

{{< code bash >}}
reflector --country Spain,France,Portugal --protocol https \
    --latest 20 --sort rate --save /etc/pacman.d/mirrorlist
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>--country Spain,France,Portugal</code>: limita la búsqueda a mirrors ubicados en esos países. Reduce la latencia y la probabilidad de caídas.</li>
<li><code>--protocol https</code>: solo acepta mirrors que sirvan por HTTPS. Evita HTTP en claro, que permitiría manipulación de paquetes en tránsito.</li>
<li><code>--latest 20</code>: se queda con los 20 mirrors más recientes en sincronizarse con el repositorio oficial. Los mirrors desactualizados pueden servir paquetes viejos o inconsistentes.</li>
<li><code>--sort rate</code>: ordena los mirrors resultantes por velocidad de descarga medida, poniendo los más rápidos primero.</li>
<li><code>--save /etc/pacman.d/mirrorlist</code>: escribe el resultado en el archivo de configuración de pacman, reemplazando la lista por defecto.</li>
</ul>

<p>Verifica que no ha quedado ningún mirror por HTTP:</p>

{{< code bash >}}
grep "^Server" /etc/pacman.d/mirrorlist | grep -vc "^Server = https"
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>grep "^Server"</code>: extrae solo las líneas que definen un servidor de la lista de mirrors.</li>
<li><code>grep -vc "^Server = https"</code>: cuenta (<code>-c</code>) las líneas que <strong>no</strong> coinciden (<code>-v</code>) con el patrón "empieza por Server = https". El resultado debe ser <code>0</code>.</li>
</ul>

<p>Si devuelve cualquier otro número, algún mirror quedó por HTTP y conviene corregir la lista antes de continuar.</p>

<h3 id="tema-2.99.7-2">7.2 Instalar el sistema base con pacstrap</h3>

<p><code>pacstrap</code> instala un conjunto de paquetes sobre el directorio indicado. Aquí se listan explícitamente los que formarán la base del sistema, sin añadir grupos completos:</p>

{{< code bash >}}
pacstrap -K /mnt \
    base linux-hardened linux linux-firmware amd-ucode \
    btrfs-progs cryptsetup \
    mkinitcpio sbctl systemd-ukify \
    efibootmgr \
    apparmor \
    nftables \
    zram-generator \
    iwd \
    sudo vim \
    man-db man-pages \
    python
{{< /code >}}

<p>Qué hace cada cosa:</p>

<ul class="step-list">
<li><code>pacstrap -K</code>: instala paquetes en el directorio indicado (<code>/mnt</code> en este caso) y usa una base de datos de paquetes vacía en lugar de reutilizar la del live. El flag <code>-K</code> garantiza que se descargan las firmas actualizadas de todos los paquetes.</li>
</ul>

<p>Qué instala cada paquete y por qué:</p>

<ul class="step-list">
<li><strong>base</strong>: conjunto mínimo de paquetes que forman la base de un sistema Arch. Incluye <code>bash</code>, <code>coreutils</code>, <code>systemd</code>, <code>pacman</code> y otros imprescindibles.</li>
<li><strong>linux-hardened</strong>: kernel con parches de endurecimiento. Es el kernel principal del sistema. Aplica mitigaciones adicionales, restricciones de memoria y controles de seguridad que no están en el kernel estándar.</li>
<li><strong>linux</strong>: kernel estándar, como respaldo. Si alguna actualización deja <code>linux-hardened</code> sin arrancar, tienes una segunda entrada firmada esperando.</li>
<li><strong>linux-firmware</strong>: metapaquete con el firmware de la mayoría de dispositivos comunes. Incluye el driver <code>iwlwifi</code> para el Wi-Fi Intel y el firmware de la GPU Radeon integrada. Sin él no hay Wi-Fi ni aceleración gráfica.</li>
<li><strong>amd-ucode</strong>: microcódigo del procesador AMD. Corrige vulnerabilidades de canal lateral como TSA, Spectre o Meltdown que se aplican en tiempo de arranque.</li>
<li><strong>btrfs-progs</strong>: herramientas para gestionar Btrfs (crear subvolúmenes, snapshots, revisar el sistema de ficheros).</li>
<li><strong>cryptsetup</strong>: utilidad para gestionar volúmenes LUKS. Sin ella el sistema no puede descifrar el disco al arrancar.</li>
<li><strong>mkinitcpio</strong>: genera la initramfs, el archivo intermedio que carga el kernel y monta la raíz.</li>
<li><strong>sbctl</strong>: herramienta para gestionar Secure Boot con claves propias.</li>
<li><strong>systemd-ukify</strong>: genera Unified Kernel Images firmables con Secure Boot.</li>
<li><strong>apparmor</strong>: módulo de control de acceso obligatorio (MAC) del kernel. Confina procesos a un conjunto de permisos predefinidos.</li>
<li><strong>nftables</strong>: framework moderno de filtrado de paquetes. Reemplaza a iptables.</li>
<li><strong>zram-generator</strong>: genera dispositivos zram al arrancar. Da swap comprimida en RAM sin tocar disco.</li>
<li><strong>iwd</strong>: cliente Wi-Fi ligero y moderno. Es la única forma de conectar red en este equipo al no tener Ethernet.</li>
<li><strong>sudo</strong>: permite ejecutar comandos con privilegios elevados desde el usuario normal.</li>
<li><strong>vim</strong>: editor de texto. Necesario para editar archivos de configuración en terminal.</li>
<li><strong>man-db</strong> y <strong>man-pages</strong>: páginas de manual. Consulta offline de documentación.</li>
<li><strong>python</strong>: intérprete de Python. Útil para scripts propios. No incluye <code>pip</code> ni <code>base-devel</code> de forma deliberada.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Por qué no se instala <code>base-devel</code> ni <code>python-pip</code>:</strong> el compilador y las herramientas de compilación amplían innecesariamente la superficie de ataque del host. Cuando se necesiten para compilar algo puntual, se usará un contenedor desechable. El intérprete de Python sí se instala porque los scripts se ejecutan sin necesidad de compilar nada.</div>
</div>

<p><code>pacstrap</code> descargará todos los paquetes, verificará sus firmas GPG contra el anillo de claves de Arch y los instalará. Al terminar, tendrás un sistema Arch mínimo con kernel, initramfs, firmwares y herramientas básicas.</p>

<h3 id="tema-2.99.7-3">7.3 Generar el fstab</h3>

<p>El archivo <code>/etc/fstab</code> describe qué particiones y subvolúmenes se montan al arrancar. <code>genfstab</code> lo genera automáticamente a partir del estado actual de los montajes:</p>

{{< code bash >}}
genfstab -U /mnt >> /mnt/etc/fstab
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>La línea de <code>/efi</code> lleva <code>umask=0077</code>.</li>
<li>No hay ninguna línea de swap en disco.</li>
<li>La línea de <code>/var/lib/containers</code> <strong>no</strong> lleva <code>nosuid</code>.</li>
<li>El atributo NOCOW está aplicado a <code>/mnt/var/lib/libvirt</code> con <code>chattr +C</code> (no aparece en el fstab porque Btrfs no lo gestiona como opción de montaje).</li>
</ul>

<p>Antes de continuar, revisa el archivo generado y añade dos líneas manuales:</p>

{{< code bash >}}
vim /mnt/etc/fstab
{{< /code >}}

<p>Añade al final del archivo:</p>

{{< code bash >}}
tmpfs  /tmp      tmpfs  rw,nosuid,nodev,noexec,size=4G,mode=1777  0 0
tmpfs  /dev/shm  tmpfs  rw,nosuid,nodev,noexec,mode=1777          0 0
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>/tmp</code> en tmpfs: el directorio temporal vive en RAM, no en disco. Al apagar se borra. Además está limitado a 4 GB para evitar que un proceso consuma toda la memoria llenando <code>/tmp</code>.</li>
<li><code>/dev/shm</code> en tmpfs: memoria compartida POSIX. También en RAM, con permisos restrictivos.</li>
<li><code>nosuid</code>: ignora los bits SUID y SGID.</li>
<li><code>nodev</code>: ignora los ficheros de dispositivo.</li>
<li><code>noexec</code>: impide ejecutar binarios desde ese directorio. Ningún proceso legítimo necesita ejecutar desde <code>/tmp</code> ni desde <code>/dev/shm</code>.</li>
<li><code>mode=1777</code>: permisos de directorio temporal estándar (lectura/escritura para todos, pero solo el propietario puede borrar sus archivos).</li>
</ul>

<p>Antes de continuar, verifica también que <code>/etc/fstab</code> cumple lo siguiente:</p>

<ul class="step-list">
<li>La línea de <code>/efi</code> lleva <code>umask=0077</code>.</li>
<li>No hay ninguna línea de swap en disco.</li>
<li>La línea de <code>/var/lib/libvirt</code> lleva <code>nodatacow</code>.</li>
<li>La línea de <code>/var/lib/containers</code> <strong>no</strong> lleva <code>nosuid</code>.</li>
</ul>

<h3 id="tema-2.99.7-4">7.4 Entrar en el sistema instalado</h3>

<p>Con el sistema base instalado y el fstab generado, el siguiente paso es entrar en el nuevo sistema para terminar de configurarlo. <code>arch-chroot</code> cambia el directorio raíz a <code>/mnt</code> y ejecuta una shell dentro del nuevo entorno:</p>

{{< code bash >}}
arch-chroot /mnt
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>arch-chroot</code>: monta los sistemas de ficheros virtuales (<code>/proc</code>, <code>/sys</code>, <code>/dev</code>, etc.) dentro del directorio indicado y ejecuta una shell con ese directorio como raíz. A partir de este momento, cualquier comando se ejecuta como si el sistema instalado estuviera arrancado. El prompt cambia para reflejarlo.</li>
</ul>

<p>Para salir del chroot cuando termines, basta con ejecutar <code>exit</code>. Volverás al entorno del live, donde <code>/mnt</code> sigue siendo el punto de montaje del sistema instalado.</p>

</div>
</section>

<section class="tema-section" id="tema-2.99.8">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.8</span> Configuración base y zram
</h2>
<div class="tema-content">

<p>Dentro del chroot, el sistema está aislado del live y cualquier comando afecta al sistema instalado. Este bloque cubre la configuración mínima para que el sistema arranque correctamente: zona horaria, locale, hostname, swap comprimida en RAM, usuario y red.</p>

<h3 id="tema-2.99.8-1">8.1 Zona horaria y reloj</h3>

{{< code bash >}}
ln -sf /usr/share/zoneinfo/Europe/Madrid /etc/localtime
hwclock --systohc
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>ln -sf</code>: crea un enlace simbólico. Fuerza (<code>-f</code>) la creación aunque exista uno previo, apuntando <code>/etc/localtime</code> al archivo de zona horaria correspondiente. A partir de ahí, el sistema sabe en qué zona horaria está.</li>
<li><code>hwclock --systohc</code>: escribe la hora actual del sistema (<em>system clock</em>) en el reloj de hardware (<em>hardware clock</em>, la CMOS). Así el equipo arranca con la hora correcta sin depender de NTP durante los primeros segundos.</li>
</ul>

<h3 id="tema-2.99.8-2">8.2 Locale</h3>

<p>Los locales definen el idioma, el formato de fechas, números, monedas y codificación de caracteres. Hay que generar los que se vayan a usar y declarar cuál es el principal:</p>

{{< code bash >}}
sed -i 's/^#es_ES.UTF-8/es_ES.UTF-8/; s/^#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
locale-gen
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>sed -i</code>: edita el archivo en sitio (sin crear copia). El patrón <code>s/^#es_ES.UTF-8/es_ES.UTF-8/</code> descomenta la línea correspondiente a español de España. Se hace también con inglés de EE.UU. porque muchas herramientas y logs están en inglés y conviene tenerlo disponible.</li>
<li><code>locale-gen</code>: lee <code>/etc/locale.gen</code> y genera los archivos de locale correspondientes en <code>/usr/lib/locale</code>. Sin este paso, el sistema no reconoce el locale aunque esté declarado.</li>
</ul>

<p>Declara el locale principal y el mapa de teclado de la consola:</p>

{{< code bash >}}
echo "LANG=es_ES.UTF-8" > /etc/locale.conf
echo "KEYMAP=es" > /etc/vconsole.conf
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>/etc/locale.conf</code>: define las variables de entorno relacionadas con el locale. <code>LANG</code> es la principal; determina el idioma por defecto de la interfaz y los mensajes del sistema.</li>
<li><code>/etc/vconsole.conf</code>: define el mapa de teclado de la consola virtual (la que se ve sin entorno gráfico). <code>KEYMAP=es</code> carga la distribución española de forma persistente al arrancar. Sin esto, el teclado sería inglés.</li>
</ul>

<h3 id="tema-2.99.8-3">8.3 Hostname y hosts</h3>

{{< code bash >}}
echo "matrix" > /etc/hostname
printf '127.0.0.1 localhost\n::1 localhost\n' > /etc/hosts
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>/etc/hostname</code>: contiene el nombre del equipo. Aparecerá en el prompt, en los logs y en la red.</li>
<li><code>/etc/hosts</code>: resuelve nombres locales antes de consultar DNS. Las dos líneas que se escriben asocian <code>localhost</code> a las direcciones de loopback IPv4 (<code>127.0.0.1</code>) e IPv6 (<code>::1</code>). Es el mínimo imprescindible; añadir el hostname aquí no es necesario en un sistema moderno con <code>systemd-resolved</code>.</li>
</ul>

<h3 id="tema-2.99.8-4">8.4 zram en lugar de swap en disco</h3>

<p>Este equipo no lleva swap en disco: la swap va en RAM comprimida con zram. Eso elimina el riesgo de que datos sensibles acaben escritos sin cifrar y es coherente con la decisión de apagar al cerrar la tapa.</p>

{{< code bash >}}
cat > /etc/systemd/zram-generator.conf << 'EOF'
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
swap-priority = 100
fs-type = swap
EOF
{{< /code >}}

<p>Qué hace cada línea:</p>

<ul class="step-list">
<li><code>[zram0]</code>: sección que define el primer dispositivo zram. El generador crea uno por cada sección con este formato.</li>
<li><code>zram-size = ram / 2</code>: tamaño del dispositivo zram, la mitad de la RAM total. Con 15 GB de RAM, serán unos 7,5 GB comprimidos, que con zstd equivalen a bastante más en la práctica.</li>
<li><code>compression-algorithm = zstd</code>: algoritmo de compresión. zstd ofrece un buen equilibrio entre velocidad y ratio de compresión.</li>
<li><code>swap-priority = 100</code>: prioridad alta. Si en algún momento hubiera otra swap (no es el caso), el kernel preferiría esta por ser más rápida.</li>
<li><code>fs-type = swap</code>: el dispositivo se formatea como swap en lugar de como sistema de ficheros normal.</li>
</ul>

<p>Ajusta también los parámetros del kernel para que la swap se comporte bien sobre zram:</p>

{{< code bash >}}
cat > /etc/sysctl.d/99-zram.conf << 'EOF'
vm.swappiness = 180
vm.watermark_boost_factor = 0
vm.watermark_scale_factor = 125
vm.page-cluster = 0
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>vm.swappiness = 180</code>: indica al kernel que tienda a usar swap con más agresividad. Los valores habituales son 10 o 60 para swap en disco. Con zram conviene justo lo contrario: swapear a RAM comprimida es rápido, así que interesa hacerlo más a menudo.</li>
<li><code>vm.watermark_boost_factor = 0</code>: desactiva el boost del watermark de memoria, que no aporta nada con zram.</li>
<li><code>vm.watermark_scale_factor = 125</code>: incrementa la distancia entre los watermarks de memoria libre. Da al kernel más margen para reaccionar antes de que la memoria se agote.</li>
<li><code>vm.page-cluster = 0</code>: lee páginas de swap de una en una, no en clusters de 8. Con zram no tiene sentido leer varias páginas juntas, porque ya se leen de RAM y no hay coste de disco que amortizar.</li>
</ul>

<h3 id="tema-2.99.8-5">8.5 Crear el usuario</h3>

{{< code bash >}}
useradd -m -G wheel -s /bin/bash cambiame
passwd cambiame
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>useradd</code>: crea un usuario nuevo. Sustituye <code>cambiame</code> por el nombre que quieras.</li>
<li><code>-m</code>: crea el directorio personal del usuario (<code>/home/usuario</code>). Sin este flag, el directorio no se crea y el usuario tendría problemas al iniciar sesión.</li>
<li><code>-G wheel</code>: añade el usuario al grupo <code>wheel</code>. Ese grupo se usará después para conceder permisos de sudo.</li>
<li><code>-s /bin/bash</code>: establece bash como shell del usuario.</li>
<li><code>passwd</code>: pide y establece la contraseña del usuario.</li>
</ul>

<p>Configura sudo para que el grupo <code>wheel</code> pueda elevar privilegios:</p>

{{< code bash >}}
EDITOR=vim visudo
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>EDITOR=vim</code>: fuerza a <code>visudo</code> a usar vim como editor.</li>
<li><code>visudo</code>: abre <code>/etc/sudoers</code> en modo edición segura. Antes de guardar, valida la sintaxis; si hay un error, se niega a escribir. Editar <code>/etc/sudoers</code> directamente puede dejar el sistema sin sudo si se comete un error tipográfico.</li>
</ul>

<p>Busca la línea y descoméntala (quita el <code>#</code> inicial):</p>

{{< code bash >}}
%wheel ALL=(ALL:ALL) ALL
{{< /code >}}

<p>Qué significa:</p>

<ul class="step-list">
<li><code>%wheel</code>: aplica a todos los miembros del grupo wheel.</li>
<li><code>ALL=(ALL:ALL)</code>: el usuario puede ejecutar comandos como cualquier usuario y cualquier grupo.</li>
<li><code>ALL</code> final: desde cualquier terminal, cualquier comando.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>No bloquees root todavía.</strong> El bloqueo de la cuenta root se hará más adelante, cuando se haya verificado que sudo funciona correctamente. Si bloqueas root ahora y sudo tiene algún problema, te quedarás fuera del sistema.</div>
</div>

<h3 id="tema-2.99.8-6">8.6 Red: iwd y systemd-networkd</h3>

<p>Este equipo solo tiene Wi-Fi, así que <code>iwd</code> es la única forma de conectarse. Habilita también <code>systemd-networkd</code> para la gestión de interfaces y <code>systemd-resolved</code> para la resolución DNS:</p>

{{< code bash >}}
systemctl enable iwd systemd-networkd systemd-resolved apparmor
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>systemctl enable iwd</code>: activa iwd al arrancar. Será el cliente que gestione las conexiones Wi-Fi.</li>
<li><code>systemctl enable systemd-networkd</code>: gestiona las interfaces de red (direcciones IP, rutas).</li>
<li><code>systemctl enable systemd-resolved</code>: gestiona la resolución de nombres y ofrece caché DNS local.</li>
<li><code>systemctl enable apparmor</code>: carga los perfiles de AppArmor al arrancar. En este punto no hay perfiles propios, pero dejamos el servicio activo para cuando los añadamos.</li>
</ul>

<p>Configura iwd:</p>

{{< code bash >}}
mkdir -p /etc/iwd
cat > /etc/iwd/main.conf << 'EOF'
[General]
AddressRandomization=network
AddressRandomizationRange=full
EnableNetworkConfiguration=true

[Network]
EnableIPv6=true
NameResolvingService=systemd
EOF
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>AddressRandomization=network</code>: genera una MAC distinta para cada red Wi-Fi a la que se conecte el equipo. La MAC será estable dentro de una misma red (para no romper portales cautivos o reservas DHCP), pero distinta entre redes.</li>
<li><code>AddressRandomizationRange=full</code>: usa el rango completo de direcciones MAC locales, maximizando la variabilidad.</li>
<li><code>EnableNetworkConfiguration=true</code>: permite a iwd configurar la interfaz (dirección IP, rutas) por sí mismo, integrando DHCP y SLAAC.</li>
<li><code>EnableIPv6=true</code>: habilita IPv6. No se desactiva IPv6 porque no hay motivo de seguridad para hacerlo y rompería compatibilidad con muchas redes modernas.</li>
<li><code>NameResolvingService=systemd</code>: delega la resolución DNS a systemd-resolved, que ofrece caché y soporte de DoT.</li>
</ul>

<p>Enlaza el archivo de resolución de systemd-resolved con el que consultan las aplicaciones:</p>

{{< code bash >}}
ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>ln -sf</code>: crea un enlace simbólico que apunta <code>/etc/resolv.conf</code> al stub que genera systemd-resolved en tiempo de ejecución. Así las aplicaciones que consultan DNS a través de <code>/etc/resolv.conf</code> pasan por systemd-resolved sin necesidad de configurar nada más.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Sobre la aleatorización de MAC:</strong> cambiar la MAC en cada red impide el seguimiento pasivo por parte de terceros que registran qué dispositivos se conectan a qué puntos de acceso. Mantenerla estable dentro de la misma red evita problemas con portales de hotel, aeropuertos o redes corporativas que asocian sesiones a una MAC concreta.</div>
</div>

<h3 id="tema-2.99.8-7">8.7 Resetear las MACs asociadas a redes</h3>

<p>Con <code>AddressRandomization=network</code> configurado en iwd, el sistema genera una MAC distinta para cada red Wi-Fi, derivada de forma estable a partir del identificador de la red. Esto significa que, mientras iwd recuerde esa red, seguirá usando la misma MAC. Si quieres que iwd genere una MAC nueva para todas las redes a las que te has conectado, hay que borrar los perfiles guardados. Al reconectarte, iwd creará perfiles nuevos y, con ellos, nuevas direcciones MAC.</p>

{{< code bash >}}
sudo rm /var/lib/iwd/*.psk /var/lib/iwd/*.open
sudo systemctl restart iwd
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>rm /var/lib/iwd/*.psk</code>: borra los perfiles de redes WPA2/WPA3 guardados. La extensión <code>.psk</code> es la que usa iwd para almacenar la contraseña y los datos de la red.</li>
<li><code>rm /var/lib/iwd/*.open</code>: borra los perfiles de redes abiertas (sin contraseña), que iwd guarda con extensión <code>.open</code>.</li>
<li><code>systemctl restart iwd</code>: reinicia el servicio para que vuelva a leer la configuración desde cero y no conserve en memoria los perfiles antiguos.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Esto borra también las contraseñas Wi-Fi guardadas.</strong> Al reconectarte a cada red, tendrás que volver a introducir la contraseña. Si solo quieres resetear una red concreta, borra únicamente su archivo. Por ejemplo, para olvidar solo la red llamada <code>MiWiFi</code>:
{{< code bash >}}
sudo rm /var/lib/iwd/MiWiFi.psk
sudo systemctl restart iwd
{{< /code >}}
El nombre del archivo es el SSID de la red seguido de la extensión correspondiente.</div>
</div>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Cuándo conviene hacer esto:</strong> si has estado conectado a muchas redes (cafeterías, aeropuertos, hoteles, oficinas de clientes) y quieres romper cualquier posible correlación entre ellas, borrar los perfiles fuerza la generación de nuevas MACs la próxima vez que te conectes a cada una. Es una operación puntual, no algo que haya que hacer cada día.</div>
</div>

</div>
</section>

<section class="tema-section" id="tema-2.99.9">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.9</span> initramfs, línea de comandos y UKI firmables
</h2>
<div class="tema-content">

<p>Este es el bloque central para todo lo relacionado con Secure Boot. La idea es que los parámetros del kernel queden <strong>dentro del binario firmado</strong>, de forma que nadie pueda añadir opciones como <code>lockdown=none</code> o <code>apparmor=0</code> desde el firmware sin invalidar la firma. Para conseguirlo se usan Unified Kernel Images (UKI), que empaquetan en un solo binario el kernel, la initramfs y la línea de comandos.</p>

<h3 id="tema-2.99.9-1">9.1 Configurar los hooks de mkinitcpio</h3>

<p>La initramfs es el archivo intermedio que carga el kernel al arrancar y que se encarga de montar la raíz real. En este caso, como la raíz está cifrada, tiene que incluir el soporte de LUKS y del TPM antes de que el sistema pueda continuar.</p>

{{< code bash >}}
vim /etc/mkinitcpio.conf
{{< /code >}}

<p>Deja la línea <code>HOOKS</code> así:</p>

{{< code bash >}}
HOOKS=(base systemd autodetect microcode modconf kms keyboard sd-vconsole block sd-encrypt filesystems fsck)
{{< /code >}}

<p>Qué hace cada hook:</p>

<ul class="step-list">
<li><code>base</code>: incluye las herramientas básicas y el script principal de initramfs.</li>
<li><code>systemd</code>: usa systemd como gestor del arranque dentro de la initramfs. Reemplaza al hook <code>udev</code> tradicional. Necesario para que funcione <code>sd-encrypt</code>.</li>
<li><code>autodetect</code>: detecta automáticamente los módulos del hardware presente y los incluye en la initramfs. Reduce el tamaño del archivo generado.</li>
<li><code>microcode</code>: añade el microcódigo de CPU que se haya instalado (<code>amd-ucode</code> en este caso) para que se cargue antes que el kernel.</li>
<li><code>modconf</code>: carga la configuración de módulos definida en <code>/etc/modprobe.d/</code>.</li>
<li><code>kms</code>: incluye los módulos de kernel de modosetting gráficos (KMS). Permite mostrar la pantalla de descifrado a resolución nativa y sin parpadeos.</li>
<li><code>keyboard</code>: incluye los módulos de teclado para poder escribir la contraseña de LUKS. Debe ir antes de <code>sd-encrypt</code>.</li>
<li><code>sd-vconsole</code>: aplica el mapa de teclado definido en <code>/etc/vconsole.conf</code> desde el momento del arranque. Sin él, el teclado español no se aplica hasta que arranca el sistema completo, lo cual es un problema si la contraseña de LUKS lleva caracteres como la <code>ñ</code>.</li>
<li><code>block</code>: carga los módulos necesarios para acceder a los dispositivos de bloque (discos).</li>
<li><code>sd-encrypt</code>: monta el volumen LUKS usando systemd-cryptsetup. Es lo que permite el desbloqueo por TPM. Reemplaza al hook <code>encrypt</code> tradicional.</li>
<li><code>filesystems</code>: carga los módulos de sistemas de ficheros que no están compilados en el kernel.</li>
<li><code>fsck</code>: comprueba la integridad de los sistemas de ficheros antes de montarlos.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Por qué <code>sd-vconsole</code> y no <code>keymap</code>:</strong> si usas <code>systemd</code> como hook de arranque, el hook correcto para el mapa de teclado es <code>sd-vconsole</code>. El tradicional <code>keymap</code> solo funciona con el flujo <code>base + udev</code>.</div>
</div>

<h3 id="tema-2.99.9-2">9.2 Definir la línea de comandos del kernel</h3>

<p>Los parámetros del kernel se escriben en archivos dentro de <code>/etc/cmdline.d/</code>. Todos los archivos <code>.conf</code> de ese directorio se concatenan en orden alfabético para formar la línea de comandos final. Separar por archivos temáticos facilita el mantenimiento.</p>

<p>Primero, obtén el UUID del volumen LUKS y guárdalo en una variable para no equivocarte al copiarlo:</p>

{{< code bash >}}
LUKS_UUID=$(blkid -s UUID -o value /dev/nvme0n1p2)
echo "UUID detectado: $LUKS_UUID"
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>blkid -s UUID -o value</code>: consulta la información del dispositivo indicado. <code>-s UUID</code> pide solo el campo del UUID; <code>-o value</code> devuelve únicamente el valor, sin el nombre del campo.</li>
<li><code>$(...)</code>: asigna el resultado del comando a la variable <code>LUKS_UUID</code>.</li>
<li><code>echo</code>: muestra el valor para poder verificarlo visualmente.</li>
</ul>

<p>Ahora crea los archivos de configuración:</p>

{{< code bash >}}
mkdir -p /etc/cmdline.d

cat > /etc/cmdline.d/00-root.conf << EOF
rd.luks.name=$LUKS_UUID=cryptroot
rd.luks.options=$LUKS_UUID=tpm2-device=auto,discard
root=/dev/mapper/cryptroot
rootflags=subvol=@
rw
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>rd.luks.name=UUID=cryptroot</code>: indica a la initramfs que abra el volumen LUKS con ese UUID y lo exponga como <code>/dev/mapper/cryptroot</code>.</li>
<li><code>rd.luks.options=UUID=tpm2-device=auto,discard</code>: opciones específicas para este volumen. <code>tpm2-device=auto</code> permite el desbloqueo automático con TPM; <code>discard</code> permite enviar TRIM al SSD, importante para no perder rendimiento.</li>
<li><code>root=/dev/mapper/cryptroot</code>: define el dispositivo raíz, que es el volumen LUKS ya descifrado.</li>
<li><code>rootflags=subvol=@</code>: indica que la raíz está en el subvolumen <code>@</code> de Btrfs.</li>
<li><code>rw</code>: monta la raíz en modo lectura-escritura desde el principio.</li>
</ul>

{{< code bash >}}
cat > /etc/cmdline.d/10-lsm.conf << 'EOF'
lsm=landlock,lockdown,yama,integrity,apparmor,bpf
lockdown=integrity
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>lsm=...</code>: define el orden en que se cargan los Linux Security Modules. Todos los listados deben estar disponibles; si falta alguno, el arranque puede caer al modo de emergencia.</li>
<li><code>lockdown=integrity</code>: activa el modo integridad del lockdown del kernel. Impide que incluso root pueda modificar el kernel en caliente (cargar módulos no firmados, acceder a <code>/dev/mem</code>, usar kexec, etc.).</li>
</ul>

{{< code bash >}}
cat > /etc/cmdline.d/20-hardening.conf << 'EOF'
init_on_alloc=1
init_on_free=1
slab_nomerge
page_alloc.shuffle=1
randomize_kstack_offset=on
vsyscall=none
debugfs=off
module.sig_enforce=1
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>init_on_alloc=1</code>: inicializa a cero la memoria asignada por el kernel. Evita fugas de datos residuales de procesos anteriores.</li>
<li><code>init_on_free=1</code>: inicializa a cero la memoria liberada. Complementa al anterior y cierra la ventana de reutilización de memoria con datos sensibles.</li>
<li><code>slab_nomerge</code>: impide que el kernel combine cachés de slab. Dificulta ataques de tipo heap grooming.</li>
<li><code>page_alloc.shuffle=1</code>: aleatoriza el orden en que se asignan las páginas de memoria física. Dificulta ataques que dependen de la colocación predecible de memoria.</li>
<li><code>randomize_kstack_offset=on</code>: aleatoriza la posición inicial del stack del kernel. Dificulta exploits de desbordamiento de pila en el kernel.</li>
<li><code>vsyscall=none</code>: desactiva el mecanismo legacy vsyscall. Elimina una superficie conocida de exploits.</li>
<li><code>debugfs=off</code>: desactiva el sistema de ficheros debugfs. No se necesita en un sistema en producción.</li>
<li><code>module.sig_enforce=1</code>: solo permite cargar módulos firmados. Refuerza la política de lockdown.</li>
</ul>

{{< code bash >}}
cat > /etc/cmdline.d/30-amd.conf << 'EOF'
amd_iommu=force_isolation
iommu.passthrough=0
iommu.strict=1
amd_pstate=active
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>amd_iommu=force_isolation</code>: en AMD, el IOMMU ya está activo por defecto, pero este parámetro fuerza el aislamiento por dispositivo en lugar de dominios compartidos. Cierra el DMA entre periféricos. Si tras arrancar algún dispositivo falla, se puede quitar esta línea y regenerar la UKI.</li>
<li><code>iommu.passthrough=0</code>: fuerza a que todas las operaciones de DMA pasen por la IOMMU, sin excepciones.</li>
<li><code>iommu.strict=1</code>: activa el modo estricto de invalidación de TLB. Más seguro que el modo diferido, a costa de un pequeño coste de rendimiento.</li>
<li><code>amd_pstate=active</code>: activa el driver de gestión de frecuencia de CPU en modo activo. Mejora la gestión de energía y batería. No es seguridad, es eficiencia.</li>
</ul>

{{< code bash >}}
cat > /etc/cmdline.d/40-quiet.conf << 'EOF'
quiet
loglevel=3
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>quiet</code>: reduce el ruido durante el arranque, mostrando solo los mensajes importantes.</li>
<li><code>loglevel=3</code>: establece el nivel mínimo de mensajes que se muestran en consola. El nivel 3 incluye errores, pero no advertencias ni información.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Sin <code>mitigations=auto,nosmt</code>.</strong> El SMT (Simultaneous Multithreading) del procesador está activo y así se queda. Desactivarlo implicaría perder la mitad del rendimiento, y para ataques de canal lateral entre hilos hermanos se necesitan condiciones muy específicas. Está documentado como excepción aceptada.</div>
</div>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Sin <code>resume=</code>.</strong> No hay hibernación porque no hay swap en disco. Es una decisión coherente con el hecho de que la tapa apague el equipo.</div>
</div>

<h3 id="tema-2.99.9-3">9.3 Crear los presets de UKI</h3>

<p>Cada kernel instalado tiene un archivo de preset en <code>/etc/mkinitcpio.d/</code> que define cómo se genera su UKI. En este caso vamos a tener dos kernels (<code>linux-hardened</code> y <code>linux</code>), cada uno con una versión <code>default</code> y otra <code>fallback</code>.</p>

{{< code bash >}}
cat > /etc/mkinitcpio.d/linux-hardened.preset << 'EOF'
ALL_kver="/boot/vmlinuz-linux-hardened"

PRESETS=('default' 'fallback')

default_image="/tmp/initramfs-linux-hardened.img"
default_uki="/efi/EFI/Linux/arch-linux-hardened.efi"
default_options="--splash /usr/share/systemd/bootctl/splash-arch.bmp"

fallback_image="/tmp/initramfs-linux-hardened-fallback.img"
fallback_uki="/efi/EFI/Linux/arch-linux-hardened-fallback.efi"
fallback_options="-S autodetect"
EOF

cat > /etc/mkinitcpio.d/linux.preset << 'EOF'
ALL_kver="/boot/vmlinuz-linux"

PRESETS=('default' 'fallback')

default_image="/tmp/initramfs-linux.img"
default_uki="/efi/EFI/Linux/arch-linux.efi"
default_options="--splash /usr/share/systemd/bootctl/splash-arch.bmp"

fallback_image="/tmp/initramfs-linux-fallback.img"
fallback_uki="/efi/EFI/Linux/arch-linux-fallback.efi"
fallback_options="-S autodetect"
EOF
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>ALL_kver</code>: ruta del kernel para el que se generan las UKI.</li>
<li><code>PRESETS</code>: variantes que se generan. <code>default</code> es la UKI normal, con todos los módulos que necesita el hardware actual. <code>fallback</code> es una versión que no usa el hook <code>autodetect</code>, por lo que incluye muchos más módulos y sirve como rescate si el sistema cambia de hardware o algo falla.</li>
<li><code>default_image</code> y <code>fallback_image</code>: ruta de la initramfs temporal que se genera antes de empaquetarla dentro de la UKI. Se deja en <code>/tmp</code> porque desaparece al reiniciar y no ocupa espacio permanentemente.</li>
<li><code>default_uki</code> y <code>fallback_uki</code>: rutas donde se escriben las UKI finales. Van dentro de la partición EFI, en <code>/efi/EFI/Linux/</code>.</li>
<li><code>default_options</code> y <code>fallback_options</code>: opciones de <code>ukify</code>, la herramienta que empaqueta la UKI. <code>--splash</code> añade una imagen de arranque; <code>-S autodetect</code> desactiva el hook autodetect para la versión fallback.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Las líneas <code>default_image</code> y <code>fallback_image</code> no son opcionales.</strong> Aunque las UKI se generan con <code>default_uki</code> y <code>fallback_uki</code>, la versión de <code>mkinitcpio</code> que acompaña a las ISOs recientes de Arch sigue exigiendo que se declare explícitamente una ruta para la initramfs temporal. Si falta, <code>mkinitcpio -P</code> no da error pero imprime un aviso por cada preset (<code>WARNING: No image or UKI specified. Skipping image</code>) y termina sin haber generado ninguna UKI. El sistema no arrancará porque el firmware no encontrará nada que ejecutar. Es un fallo silencioso: si no se revisa la salida de <code>mkinitcpio -P</code>, no se detecta hasta el reinicio.</div>
</div>

<p>Ninguna línea <code>_image=</code> apunta a <code>/boot</code>: eso significa que las initramfs temporales no se conservan, solo se usan como paso intermedio. <code>/boot</code> es un directorio dentro del subvolumen cifrado, así que el <code>vmlinuz</code> vive cifrado y lo único en claro es la UKI de la ESP, que va firmada.</p>

<p>Genera las UKI:</p>

{{< code bash >}}
mkdir -p /efi/EFI/Linux /efi/EFI/BOOT
mkinitcpio -P
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>mkdir -p</code>: crea los directorios donde se escribirán las UKI, si no existen.</li>
<li><code>mkinitcpio -P</code>: ejecuta la generación de todas las UKI definidas en los presets. La <code>P</code> mayúscula indica "todos los presets".</li>
</ul>

<p>La salida debe incluir el mensaje <code>Unified kernel image generation successful</code> cuatro veces: dos kernels por dos variantes cada uno. Es normal ver avisos sobre firmware opcional que no se encuentra (<code>Possible missing firmware</code>); hacen referencia a módulos de GPU o Wi-Fi que no tienes y no impiden el arranque. Lo que <strong>no</strong> debe aparecer es el aviso <code>WARNING: No image or UKI specified</code>.</p>

<h3 id="tema-2.99.9-4">9.4 Crear entradas de arranque y respaldo</h3>

<p>Ahora hay que decirle al firmware que arranque la UKI. Se crean dos entradas: una para <code>linux-hardened</code> y otra para el kernel de rescate.</p>

{{< code bash >}}
efibootmgr --create --disk /dev/nvme0n1 --part 1 \
    --label "Arch Linux (hardened)" \
    --loader '\EFI\Linux\arch-linux-hardened.efi' --unicode

efibootmgr --create --disk /dev/nvme0n1 --part 1 \
    --label "Arch Linux (rescate)" \
    --loader '\EFI\Linux\arch-linux.efi' --unicode

efibootmgr -v
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>--create</code>: crea una nueva entrada de arranque.</li>
<li><code>--disk</code> y <code>--part</code>: disco y partición donde está la UKI.</li>
<li><code>--label</code>: nombre que aparecerá en el menú de arranque del firmware.</li>
<li><code>--loader</code>: ruta de la UKI dentro de la partición EFI. Las barras invertidas son las que usa el firmware UEFI.</li>
<li><code>--unicode</code>: codifica correctamente los caracteres no ASCII del label.</li>
<li><code>-v</code>: muestra todas las entradas existentes en modo detallado, para verificar que se han creado bien.</li>
</ul>

<p><strong>Red de seguridad específica de ASUS.</strong> Algunos firmwares de Zenbook ignoran o descartan las entradas NVRAM personalizadas tras una actualización o un corte de corriente. Copia la UKI también a la ruta de arranque por defecto, que el firmware siempre encuentra:</p>

{{< code bash >}}
cp /efi/EFI/Linux/arch-linux-hardened.efi /efi/EFI/BOOT/BOOTX64.EFI
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>cp</code>: copia la UKI de <code>hardened</code> al archivo <code>BOOTX64.EFI</code>. Ese nombre concreto es el que el firmware UEFI busca por defecto si no encuentra otra entrada configurada. Es la vía de rescate si la NVRAM se borra.</li>
</ul>

<p>Para que esa copia se mantenga actualizada y firmada, se añade un hook de pacman que la regenera cada vez que se actualiza el kernel o systemd:</p>

{{< code bash >}}
mkdir -p /etc/pacman.d/hooks
cat > /etc/pacman.d/hooks/95-uki-fallback.hook << 'EOF'
[Trigger]
Operation = Install
Operation = Upgrade
Type = Package
Target = linux-hardened
Target = systemd
Target = mkinitcpio

[Action]
Description = Copiando y firmando la UKI de respaldo en EFI/BOOT...
When = PostTransaction
Exec = /bin/sh -c '/usr/bin/cp /efi/EFI/Linux/arch-linux-hardened.efi /efi/EFI/BOOT/BOOTX64.EFI && /usr/bin/sbctl sign /efi/EFI/BOOT/BOOTX64.EFI'
Depends = sbctl
EOF
{{< /code >}}

<p>Qué hace cada bloque:</p>

<ul class="step-list">
<li><code>[Trigger]</code>: define cuándo se ejecuta el hook. Aquí, tras instalar o actualizar <code>linux-hardened</code>, <code>systemd</code> o <code>mkinitcpio</code>.</li>
<li><code>[Action]</code>: define qué hace el hook. Copia la UKI de <code>hardened</code> al respaldo y le aplica la firma de Secure Boot con <code>sbctl</code>.</li>
<li><code>Depends = sbctl</code>: garantiza que <code>sbctl</code> esté instalado antes de ejecutar el hook.</li>
</ul>

<h3 id="tema-2.99.9-5">9.5 Comprobación antes de salir del chroot</h3>

<p>Verifica que el UUID del archivo de línea de comandos coincide exactamente con el del volumen LUKS. Un dígito mal aquí es la causa del 90 % de los "no arranca".</p>

{{< code bash >}}
cat /etc/cmdline.d/00-root.conf
blkid -s UUID -o value /dev/nvme0n1p2
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>cat /etc/cmdline.d/00-root.conf</code>: muestra el contenido del archivo, donde está el UUID que se usará al arrancar.</li>
<li><code>blkid</code>: consulta el UUID real del volumen LUKS. Ambos valores deben ser idénticos carácter a carácter.</li>
</ul>

<p>Comprueba también que las UKI existen en la partición EFI:</p>

{{< code bash >}}
ls -la /efi/EFI/Linux/ /efi/EFI/BOOT/
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>ls -la</code>: lista con detalles (permisos, tamaño, fecha) los archivos en ambos directorios. Deben aparecer las cuatro UKI en <code>/efi/EFI/Linux/</code> y el <code>BOOTX64.EFI</code> en <code>/efi/EFI/BOOT/</code>.</li>
</ul>

<p>Si todo está correcto, sal del chroot y reinicia:</p>

{{< code bash >}}
exit
umount -R /mnt
reboot
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>exit</code>: sale del chroot y vuelve al entorno del live.</li>
<li><code>umount -R /mnt</code>: desmonta recursivamente todos los sistemas de ficheros montados bajo <code>/mnt</code>, en orden inverso al de montaje. Es importante hacerlo antes de reiniciar para que los datos se sincronicen a disco correctamente.</li>
<li><code>reboot</code>: reinicia el equipo. Quita el USB antes de que arranque, o el firmware podría volver a cargar el live en lugar del sistema instalado.</li>
</ul>

</div>
</section>

<section class="tema-section" id="tema-2.99.10">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.10</span> Primer arranque y verificación inicial
</h2>
<div class="tema-content">

<p>El sistema ya arranca. Ahora toca iniciar sesión y comprobar que todo lo que configuramos en el chroot se ha aplicado correctamente. Esta verificación es importante antes de seguir con el endurecimiento, porque si algo falla en este punto es mucho más fácil de diagnosticar ahora que después de añadir más capas.</p>

<h3 id="tema-2.99.10-1">10.1 Iniciar sesión</h3>

<p>En el prompt de login introduce el nombre del usuario que creaste (en la guía usamos <code>cambiame</code> como ejemplo) y su contraseña. No uses root; esa cuenta está bloqueada y no debe usarse para el trabajo diario.</p>

<p>Si el login no acepta la contraseña, revisa que el teclado esté en español. En la consola, el mapa de teclado se aplica desde <code>/etc/vconsole.conf</code>, que ya configuramos. Si aun así falla, puede que la contraseña tenga caracteres que no se están escribiendo bien. En ese caso, arranca con el USB, entra en el chroot y restablece la contraseña con <code>passwd cambiame</code>.</p>

<h3 id="tema-2.99.10-2">10.2 Conectar el Wi-Fi</h3>

<p><code>iwd</code> está habilitado como servicio, pero no conserva los perfiles de red del live. Hay que conectarse de nuevo usando <code>iwctl</code>:</p>

{{< code bash >}}
iwctl
[iwd]# station wlan0 connect NOMBRE_DE_TU_RED
[iwd]# exit
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>iwctl</code>: abre el cliente interactivo de iwd.</li>
<li><code>station wlan0 connect</code>: inicia la conexión a la red indicada. Pedirá la contraseña si es WPA2 o WPA3.</li>
<li><code>exit</code>: sale del cliente interactivo.</li>
</ul>

<p>Comprueba que hay conexión:</p>

{{< code bash >}}
ping -c3 archlinux.org
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>ping</code>: envía paquetes ICMP al destino. Con <code>-c3</code> envía tres y termina. Si hay respuesta, la red funciona.</li>
</ul>

<h3 id="tema-2.99.10-3">10.3 Verificar la línea de comandos del kernel</h3>

<p>Los parámetros que escribimos en <code>/etc/cmdline.d/</code> deben estar aplicados. Compruébalo con estos comandos:</p>

{{< code bash >}}
cat /sys/kernel/security/lockdown
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra el estado del lockdown del kernel. Debe aparecer <code>[integrity]</code>, lo que indica que está activo en modo integridad. Si aparece <code>[none]</code>, la línea <code>lockdown=integrity</code> no se ha aplicado y habría que revisar el archivo <code>10-lsm.conf</code>.</li>
</ul>

{{< code bash >}}
aa-enabled
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Comprueba si AppArmor está activo. Debe responder <code>Yes</code>. Si responde <code>No</code>, el servicio no ha arrancado o no está habilitado.</li>
</ul>

{{< code bash >}}
zramctl
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra los dispositivos zram activos. Debe aparecer uno llamado <code>/dev/zram0</code> con un tamaño aproximado de la mitad de la RAM (unos 7,5 GB si tienes 15 GB). Si no aparece nada, el generador de zram no ha arrancado o la configuración tiene un error.</li>
</ul>

{{< code bash >}}
cat /sys/devices/system/cpu/vulnerabilities/tsa
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra el estado de mitigación de TSA. Si dice <code>Mitigation: Clear CPU buffers</code>, el microcódigo se ha cargado correctamente y la vulnerabilidad está mitigada. Si dice <code>Vulnerable: No microcode</code>, hay que revisar que <code>amd-ucode</code> esté instalado y que el hook <code>microcode</code> esté presente en la initramfs.</li>
</ul>

<h3 id="tema-2.99.10-4">10.4 Revisar el estado general</h3>

<p>Comprueba que no haya servicios fallidos y que el journal no tenga errores graves:</p>

{{< code bash >}}
systemctl --failed
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Lista las unidades de systemd que han fallado. Si aparece alguna, investígala con <code>systemctl status nombre.service</code>. En un sistema recién instalado no debería haber ninguna.</li>
</ul>

{{< code bash >}}
journalctl -p err -b
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra los mensajes del journal de la sesión de arranque actual filtrados por prioridad de error. Es normal ver algún error puntual de hardware sin driver, pero no debería haber errores repetidos ni fallos graves de servicios.</li>
</ul>

<h3 id="tema-2.99.10-5">10.5 Actualizar el sistema</h3>

<p>Aunque acabamos de instalar desde los repositorios, conviene actualizar por si han entrado cambios desde entonces:</p>

{{< code bash >}}
sudo pacman -Syu
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sudo</code>: ejecuta el comando como root.</li>
<li><code>pacman -Syu</code>: sincroniza la base de datos de paquetes (<code>-Sy</code>) y actualiza el sistema completo (<code>-u</code>).</li>
</ul>

<h3 id="tema-2.99.10-6">10.6 Sobre el TPM</h3>

<p>En este punto el sistema pide la contraseña de LUKS manualmente cada vez que arranca. Como todavía no hemos sellado ninguna clave dentro de él, ese intento fallará de forma silenciosa y el sistema te pedirá la contraseña manualmente. Este comportamiento es correcto y esperado.</p>

<p>La configuración definitiva del TPM se hará en el siguiente bloque, cuando ya tengamos Secure Boot activado y podamos sellarlo correctamente.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>No te preocupes si el arranque tarda un poco</strong> en este primer inicio. systemd está generando por primera vez algunos archivos de estado y cachés. Los siguientes arranques serán notablemente más rápidos.</div>
</div>

</div>
</section>
<section class="tema-section" id="tema-2.99.11">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.11</span> Secure Boot con claves propias
</h2>
<div class="tema-content">

<p>En este bloque vamos a activar Secure Boot usando nuestras propias claves en lugar de las de fábrica de Microsoft. La ventaja es que solo arrancarán los binarios que nosotros hayamos firmado. La desventaja es que cualquier actualización de firmware o cambio de configuración de la BIOS puede invalidar las firmas y dejarnos fuera, así que hay que hacerlo con cuidado.</p>

<h3 id="tema-2.99.11-1">11.1 Verificar el estado inicial</h3>

<p>Antes de tocar nada, comprueba que el firmware está en modo de configuración (Setup Mode). Esto significa que no hay ninguna clave de plataforma activa y podemos instalar las nuestras:</p>

{{< code bash >}}
sudo pacman -S sbctl
sudo sbctl status
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sbctl status</code>: muestra el estado actual del firmware respecto a Secure Boot. Debe indicar <code>Setup Mode: Enabled</code> y <code>Secure Boot: Disabled</code>.</li>
</ul>

<p>Si <code>Setup Mode</code> aparece como <code>Disabled</code>, significa que el firmware todavía tiene las claves de fábrica y no permite escribir. En ese caso hay que entrar en la BIOS (ESC), ir a <strong>Security → Secure Boot Control [Enabled] → Key Management</strong> y seleccionar <strong>Clear Secure Boot Keys</strong>. Reinicia y vuelve a comprobar el estado.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Si no encuentras la opción de Key Management</strong>, es posible que necesites tener configurada la contraseña de administrador de la BIOS para que aparezca. Si es así, ponla, guarda los cambios, reinicia y vuelve a entrar. Recuerda que en este modelo ASUS el menú puede tardar en aparecer hasta que la contraseña está establecida.</div>
</div>

<h3 id="tema-2.99.11-2">11.2 Crear las claves propias</h3>

<p>Ahora generamos las claves criptográficas que usaremos para firmar todo lo que deba arrancar. <code>sbctl</code> crea tres pares de claves (PK, KEK y db) en <code>/var/lib/sbctl</code>:</p>

{{< code bash >}}
sudo sbctl create-keys
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sbctl create-keys</code>: genera un juego completo de claves de Secure Boot. La <strong>PK</strong> (Platform Key) es la clave raíz del sistema. La <strong>KEK</strong> (Key Exchange Key) autoriza cambios en la base de datos de firmas. La <strong>db</strong> (Signature Database) contiene las claves con las que se firman los binarios.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Haz copia de seguridad de <code>/var/lib/sbctl</code>.</strong> Si pierdes estas claves, no podrás firmar nuevos binarios y, si el firmware está en modo usuario (User Mode), no podrás arrancar nada que no esté ya firmado. La copia se hará formalmente en el bloque de emergencia, pero conviene tenerla presente desde ahora.</div>
</div>

<h3 id="tema-2.99.11-3">11.3 Enrolar las claves en el firmware</h3>

<p>Con las claves creadas, hay que decírselo al firmware. <code>sbctl</code> se encarga de escribir las variables EFI correspondientes:</p>

{{< code bash >}}
sudo sbctl enroll-keys --microsoft
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>enroll-keys</code>: escribe las claves públicas (PK, KEK y db) en las variables EFI del firmware.</li>
<li><code>--microsoft</code>: añade también los certificados de Microsoft a la base de datos. Sin esta opción, algunos componentes del firmware que están firmados por Microsoft (como las opciones de arranque por red) podrían dejar de funcionar. En un portátil doméstico no es crítico, pero ayuda a evitar sorpresas.</li>
</ul>

<p>Tras ejecutarlo, reinicia la BIOS para asegurarte de que las claves se han escrito correctamente. Puedes comprobarlo de nuevo con <code>sbctl status</code> antes de continuar.</p>

<h3 id="tema-2.99.11-4">11.4 Firmar las UKI</h3>

<p>Ahora hay que firmar cada una de las Unified Kernel Images que generamos en el bloque anterior. La opción <code>-s</code> es crítica: le dice a <code>sbctl</code> que guarde el archivo en su base de datos y lo vuelva a firmar automáticamente cada vez que se regenere:</p>

{{< code bash >}}
sudo sbctl sign -s /efi/EFI/Linux/arch-linux-hardened.efi
sudo sbctl sign -s /efi/EFI/Linux/arch-linux-hardened-fallback.efi
sudo sbctl sign -s /efi/EFI/Linux/arch-linux.efi
sudo sbctl sign -s /efi/EFI/Linux/arch-linux-fallback.efi
sudo sbctl sign -s /efi/EFI/BOOT/BOOTX64.EFI
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>sign</code>: firma el archivo indicado con la clave privada creada antes.</li>
<li><code>-s</code>: añade el archivo a la base de datos de <code>sbctl</code>. Cada vez que se regenere (por ejemplo, tras una actualización de kernel), el hook de pacman lo volverá a firmar automáticamente. Sin <code>-s</code>, la próxima actualización dejaría la UKI sin firmar y el sistema no arrancaría.</li>
</ul>

<p>Verifica que todos los archivos están firmados correctamente:</p>

{{< code bash >}}
sudo sbctl verify
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>verify</code>: comprueba que cada archivo firmado tiene una firma válida y que el firmware está configurado para confiar en ella. Debe mostrar todos los archivos como <code>Signed</code>.</li>
</ul>

<h3 id="tema-2.99.11-5">11.5 Activar Secure Boot en la BIOS</h3>

<p>Este paso se hace desde la BIOS, no desde Linux:</p>

<ol>
<li>Reinicia y pulsa <strong>ESC</strong> para entrar en la BIOS.</li>
<li>Ve a <strong>Security → Secure Boot</strong>.</li>
<li>Cambia <strong>Secure Boot Control</strong> de <code>Disabled</code> a <code>Enabled</code>.</li>
<li>Guarda los cambios (<strong>F10</strong>) y reinicia.</li>
</ol>

<p>Ahora mismo deberías tener la contraseña de administrador puesta. Si te la pide para cambiar esta opción, introdúcela.</p>

<h3 id="tema-2.99.11-6">11.6 Verificar que Secure Boot está activo</h3>

<p>Una vez dentro de Arch Linux, comprueba el estado:</p>

{{< code bash >}}
sudo sbctl status
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra el estado actual. Debe indicar <code>Secure Boot: Enabled (User Mode)</code>. Esto significa que Secure Boot está activo y que el firmware está usando nuestras claves, no las de fábrica.</li>
</ul>

{{< code bash >}}
bootctl status
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>bootctl status</code>: consulta el estado del arranque según systemd-boot. Debe mostrar <code>Secure Boot: <strong>enabled</strong></code>.</li>
</ul>

<div class="callout callout-danger">
<span class="callout-icon">🚨</span>
<div class="callout-body"><strong>Si tras activar Secure Boot el equipo no arranca</strong>, apágalo y vuelve a entrar en la BIOS. Desactiva Secure Boot, arranca de nuevo con el USB de Arch y revisa que todas las UKI estén firmadas con <code>sbctl verify</code>. Es muy probable que alguna se haya quedado sin firmar por no haber usado la opción <code>-s</code> en el paso anterior.</div>
</div>

</div>
</section>
<section class="tema-section" id="tema-2.99.12">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.12</span> TPM, PIN y copias de emergencia
</h2>
<div class="tema-content">

<p>Con Secure Boot activo, ya podemos sellar el TPM. El TPM guardará una copia de la clave de LUKS, pero solo la liberará si el estado del arranque coincide exactamente con el que tenía en el momento del sellado. En este caso, se sella a PCR 7, que mide el estado de Secure Boot. Si alguien altera la cadena de arranque, el TPM no liberará la clave y el sistema pedirá la contraseña manual.</p>

<p>Pero antes de sellar nada, hay que preparar la salida de emergencia. El fTPM de AMD es firmware, no un chip aparte. Un <em>Clear CMOS</em> o una actualización de AGESA pueden resetearlo y perder el sellado. Cuando eso ocurra, necesitarás la contraseña de recuperación para entrar y volver a sellar. Si no la tienes, el disco es ilegible.</p>

<h3 id="tema-2.99.12-1">12.1 Copias de seguridad primero</h3>

<p>Antes de tocar el TPM, haz dos copias: una de la cabecera LUKS y otra de la clave de recuperación.</p>

<p>La cabecera LUKS contiene la información necesaria para descifrar el disco. Si se corrompe (por un fallo del disco, un apagado brusco durante una operación de escritura, o un ataque que intente destruirla), el disco se vuelve inaccesible aunque tengas la contraseña. Guardar una copia en un USB externo te permite restaurarla y recuperar el acceso.</p>

{{< code bash >}}
sudo cryptsetup luksHeaderBackup /dev/nvme0n1p2 \
    --header-backup-file /root/luks-header-$(date +%F).img
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>cryptsetup luksHeaderBackup</code>: hace una copia de la cabecera del volumen LUKS, incluyendo los slots de claves y los metadatos de cifrado.</li>
<li><code>--header-backup-file</code>: ruta donde se guarda la copia. El <code>$(date +%F)</code> añade la fecha actual en formato año-mes-día, para que no se sobrescriba si se hace más de una vez.</li>
</ul>

<p>La segunda copia es la clave de recuperación. Es una clave aleatoria larga que <code>systemd-cryptenroll</code> puede generar como método alternativo de desbloqueo. Sirve para entrar cuando el TPM falle.</p>

{{< code bash >}}
sudo systemd-cryptenroll --recovery-key /dev/nvme0n1p2
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>--recovery-key</code>: genera una clave de recuperación aleatoria y la añade como un nuevo slot de LUKS. La clave se muestra una sola vez en pantalla y no se puede recuperar después. Cópiala en papel, literalmente, con mayúsculas, minúsculas y guiones exactos.</li>
</ul>

<div class="callout callout-danger">
<span class="callout-icon">🚨</span>
<div class="callout-body"><strong>Apunta la clave de recuperación en papel.</strong> No la guardes en el propio portátil, ni en una nota del móvil, ni en un gestor de contraseñas que esté dentro del disco cifrado. Si el disco es lo que intentas recuperar, no puedes depender de algo que esté dentro de él. Papel, y guardado en un sitio físico distinto del portátil.</div>
</div>

<h3 id="tema-2.99.12-2">12.2 Sellar el TPM</h3>

<p>Ahora sí, se sella la clave de LUKS dentro del TPM. A partir de este momento, el sistema podrá desbloquear el disco automáticamente si el estado del arranque es el esperado.</p>

{{< code bash >}}
sudo systemd-cryptenroll /dev/nvme0n1p2 \
    --tpm2-device=auto \
    --tpm2-pcrs=7 \
    --tpm2-with-pin=yes
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>--tpm2-device=auto</code>: usa el primer TPM disponible. Como solo tienes uno (el fTPM de AMD), no hace falta especificar la ruta.</li>
<li><code>--tpm2-pcrs=7</code>: sella la clave a PCR 7, que mide el estado de Secure Boot. Si Secure Boot se desactiva o se modifican las claves, PCR 7 cambia y el TPM no liberará la clave.</li>
<li><code>--tpm2-with-pin=yes</code>: exige un PIN además del estado del arranque. Es la diferencia entre "el sistema arranca solo" y "el sistema arranca cuando yo se lo autorizo". Sin PIN, cualquier persona que robe el portátil apagado puede arrancarlo y montar el disco sin saber nada. Con PIN, necesita el PIN además del equipo.</li>
</ul>

<p>El PIN se pide dos veces al configurarlo, para evitar errores tipográficos. Elige algo que puedas recordar y teclear rápido en la pantalla de arranque, porque lo vas a escribir en cada encendido. Un PIN de 6 a 8 dígitos numéricos es un buen equilibrio entre comodidad y seguridad.</p>

<p>Verifica que el sellado se ha creado correctamente:</p>

{{< code bash >}}
sudo cryptsetup luksDump /dev/nvme0n1p2 | grep -E "systemd-tpm2|systemd-recovery|Tokens"
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>luksDump</code>: muestra la información de la cabecera LUKS, incluyendo todos los slots de claves activos.</li>
<li><code>grep</code>: filtra por las líneas relevantes. Debe aparecer una entrada para <code>systemd-tpm2</code> (el sellado) y otra para <code>systemd-recovery</code> (la clave de recuperación).</li>
</ul>

<p>Reinicia para comprobar que todo funciona:</p>

{{< code bash >}}
sudo reboot
{{< /code >}}

<p>Ahora, en lugar de pedirte la contraseña completa de LUKS, el sistema te pedirá el PIN del TPM. Introdúcelo y el disco se descifrará automáticamente. Si pide la contraseña completa en lugar del PIN, revisa que la línea <code>rd.luks.options</code> de <code>/etc/cmdline.d/00-root.conf</code> sigue ahí con <code>tpm2-device=auto</code>.</p>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Solo con PCR 7, cualquier UKI firmada con tu clave abre el disco.</strong> Si alguien roba tu clave privada de firma, puede firmar una UKI que haga lo que quiera y PCR 7 seguirá siendo válido. Por eso son obligatorios el PIN y guardar <code>/var/lib/sbctl</code> fuera del equipo. Si te roban la clave de firma, PCR 7 deja de protegerte.</div>
</div>

<h3 id="tema-2.99.12-3">12.3 Crear el USB de emergencia</h3>

<p>Ahora toca preparar el USB que te salvará cuando algo vaya mal. Este USB se guarda <strong>fuera del portátil</strong>, en un sitio físico distinto. Si lo llevas siempre contigo en la mochila, un robo del portátil y la mochila se lleva las dos cosas, y no sirve de nada.</p>

<p>Cifra el USB con LUKS para que si se pierde no quede nada expuesto:</p>

{{< code bash >}}
sudo cryptsetup luksFormat /dev/sdX1
sudo cryptsetup open /dev/sdX1 rescate
sudo mkfs.ext4 /dev/mapper/rescate
sudo mkdir -p /mnt/rescate
sudo mount /dev/mapper/rescate /mnt/rescate
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>luksFormat</code>: formatea la partición del USB con LUKS2. Sustituye <code>/dev/sdX1</code> por el nombre real del USB, que puedes ver con <code>lsblk</code>.</li>
<li><code>cryptsetup open</code>: abre el volumen cifrado para poder escribir dentro.</li>
<li><code>mkfs.ext4</code>: formatea el volumen descifrado con ext4.</li>
<li><code>mount</code>: monta el volumen en <code>/mnt/rescate</code>.</li>
</ul>

<p>Copia los archivos críticos dentro del USB:</p>

{{< code bash >}}
sudo cp /root/luks-header-*.img /mnt/rescate/
sudo cp -a /var/lib/sbctl /mnt/rescate/sbctl-keys/
sudo umount /mnt/rescate
sudo cryptsetup close rescate
sudo shred -u /root/luks-header-*.img
{{< /code >}}

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Si el primer comando falla con un error similar a <code>cp: no se puede efectuar 'stat' sobre '/root/luks-header-*.img': No existe el fichero o el directorio</code></strong>, significa que la copia de la cabecera no se generó correctamente antes, o se guardó en otra ruta. En ese caso, genera la copia directamente en el USB. Asegúrate de que el volumen <code>rescate</code> sigue abierto y montado en <code>/mnt/rescate</code> y ejecuta:

{{< code bash >}}
sudo cryptsetup luksHeaderBackup /dev/nvme0n1p2 \
    --header-backup-file /mnt/rescate/luks-header-$(date +%F).img
{{< /code >}}

Una vez generada la cabecera directamente en el USB, continúa con los comandos habituales para copiar las claves de <code>sbctl</code> (<code>sudo cp -a /var/lib/sbctl /mnt/rescate/sbctl-keys/</code>) y luego desmonta y cierra el volumen con <code>umount</code> y <code>cryptsetup close</code>.
</div>
</div>

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>cp /root/luks-header-*.img</code>: copia la cabecera LUKS al USB. El <code>*</code> recoge todas las copias con fecha que hayas hecho.</li>
<li><code>cp -a /var/lib/sbctl</code>: copia el directorio completo con las claves de Secure Boot. La opción <code>-a</code> preserva permisos y atributos.</li>
<li><code>umount</code> y <code>cryptsetup close</code>: cierran el volumen y el contenedor cifrado de forma limpia.</li>
<li><code>shred -u</code>: borra de forma segura la copia de la cabecera que quedó en <code>/root</code>. Sin <code>-u</code>, <code>shred</code> sobrescribe el archivo pero no lo elimina; con <code>-u</code>, lo borra después de sobrescribirlo.</li>
</ul>

<p>El USB debe contener, como mínimo:</p>

<ul class="step-list">
<li>La cabecera LUKS.</li>
<li>La clave de recuperación LUKS, <strong>en papel aparte, no dentro del USB</strong>.</li>
<li>El directorio <code>/var/lib/sbctl</code> completo, con las claves de firma.</li>
<li>Una copia de la documentación de esta guía, por si la necesitas sin conexión.</li>
<li>La ISO de Arch verificada, por si necesitas arrancar desde cero.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Prueba el USB antes de guardarlo.</strong> Ábrelo con la contraseña que le hayas puesto y comprueba que los archivos están dentro. Un USB de emergencia que no funciona es peor que no tenerlo, porque te da una falsa sensación de seguridad.</div>
</div>

</div>
</section>

<section class="tema-section" id="tema-2.99.13">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.13</span> Base segura del sistema (Fase 1)
</h2>
<div class="tema-content">

<p>Con el sistema instalado, cifrado y arrancando con Secure Boot, es el momento de empezar a reducir la superficie de ataque. Esta fase se centra en tres cosas: asegurar la cadena de suministro de paquetes, auditar los binarios con privilegios y limpiar cuentas y servicios innecesarios.</p>

<h3 id="tema-2.99.13-1">13.1 Cadena de suministro</h3>

<p>La primera línea de defensa es asegurarse de que los paquetes que se instalan vienen de donde dicen venir y no han sido manipulados. Arch Linux firma todos los paquetes de los repositorios oficiales, pero la configuración de pacman puede relajarse sin querer.</p>

{{< code bash >}}
sudo vim /etc/pacman.conf
{{< /code >}}

<p>Deja el bloque de opciones así:</p>

{{< code bash >}}
[options]
CheckSpace
VerbosePkgLists
ParallelDownloads = 5
SigLevel           = Required DatabaseOptional
LocalFileSigLevel  = Optional
{{< /code >}}

<p>Qué hace cada línea:</p>

<ul class="step-list">
<li><code>CheckSpace</code>: verifica que hay espacio suficiente en disco antes de empezar una instalación o actualización. Evita que el sistema se quede a medias por falta de espacio.</li>
<li><code>VerbosePkgLists</code>: muestra más información al listar paquetes, útil para diagnosticar conflictos.</li>
<li><code>ParallelDownloads = 5</code>: descarga hasta cinco paquetes en paralelo. Acelera las actualizaciones sin saturar la red.</li>
<li><code>SigLevel = Required DatabaseOptional</code>: exige que todos los paquetes estén firmados. <code>DatabaseOptional</code> permite que la base de datos de paquetes no esté firmada, pero los paquetes en sí sí deben estarlo.</li>
<li><code>LocalFileSigLevel = Optional</code>: permite instalar paquetes locales (por ejemplo, desde un archivo <code>.pkg.tar.zst</code>) sin firma. Útil para paquetes propios o para compilaciones puntuales.</li>
</ul>

<p>Comprueba que no haya ningún repositorio sospechoso ni ninguna directiva <code>SigLevel = Never</code>:</p>

{{< code bash >}}
sudo grep -rn "SigLevel" /etc/pacman.conf /etc/pacman.d/ | grep -v "^.*#"
grep "^\[" /etc/pacman.conf
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>grep -rn "SigLevel"</code>: busca la palabra en todos los archivos de configuración de pacman. <code>-r</code> recorre directorios, <code>-n</code> muestra número de línea. Se excluyen las líneas comentadas con <code>grep -v "^.*#"</code>.</li>
<li><code>grep "^\["</code>: muestra solo las líneas que definen repositorios. Deben aparecer únicamente <code>[options]</code>, <code>[core]</code> y <code>[extra]</code>. Si aparece cualquier otro repositorio (por ejemplo <code>[blackarch]</code>), conviene revisar por qué está ahí.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Nada de repositorios externos en el host.</strong> El repositorio de BlackArch, por ejemplo, añade miles de herramientas ofensivas que amplían la superficie de ataque de forma innecesaria. Esas herramientas se ejecutan en la máquina virtual dedicada, no en el sistema principal.</div>
</div>

<h3 id="tema-2.99.13-2">13.2 Auditoría de binarios SUID y SGID</h3>

<p>Los binarios con el bit SUID o SGID activo se ejecutan con los privilegios del propietario o del grupo, respectivamente. Son una vía clásica de escalada local de privilegios si tienen un fallo. Conviene saber cuáles hay y quitar los que no se usen.</p>

{{< code bash >}}
sudo find / -xdev \( -perm -4000 -o -perm -2000 \) -type f -printf "%M %u %g %p\n" 2>/dev/null | sort -k4
{{< /code >}}

<p>Qué hace cada parte:</p>

<ul class="step-list">
<li><code>find / -xdev</code>: busca en todo el sistema de ficheros raíz, sin cruzar a otros sistemas montados como <code>/home</code> o <code>/efi</code>. Eso evita ruido y posibles errores en particiones externas.</li>
<li><code>\( -perm -4000 -o -perm -2000 \)</code>: encuentra archivos que tengan activado el bit SUID (4000) o el SGID (2000).</li>
<li><code>-type f</code>: solo archivos regulares, no directorios ni dispositivos.</li>
<li><code>-printf "%M %u %g %p\n"</code>: formato de salida personalizado: permisos, usuario propietario, grupo propietario y ruta completa.</li>
<li><code>2>/dev/null</code>: descarta los mensajes de error de permisos denegados, que son numerosos al recorrer todo el sistema.</li>
<li><code>sort -k4</code>: ordena por la cuarta columna, que es la ruta, para ver la lista organizada.</li>
</ul>

<p>Guarda el resultado como referencia para comparar en el futuro:</p>

{{< code bash >}}
sudo find / -xdev \( -perm -4000 -o -perm -2000 \) -type f 2>/dev/null | sort | sudo tee /root/baseline-suid.txt
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>tee</code>: escribe el resultado tanto en pantalla como en el archivo indicado. Así ves la lista y la guardas a la vez.</li>
</ul>

<p>En una instalación mínima como esta deberías ver alrededor de una docena de binarios. Muchos de ellos son necesarios para el funcionamiento normal del sistema. Sin embargo, algunos solo se usan en casos muy concretos y pueden desactivarse:</p>

{{< code bash >}}
sudo chmod u-s /usr/bin/chfn /usr/bin/chsh
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>chmod u-s</code>: quita el bit SUID al archivo. <code>chfn</code> y <code>chsh</code> permiten cambiar la información del usuario y la shell por defecto, respectivamente. En un sistema de uso personal no suelen necesitarse.</li>
</ul>

<p>Para que estos cambios no se reviertan en la próxima actualización de los paquetes que los contienen, se añade un hook de pacman:</p>

{{< code bash >}}
sudo mkdir -p /etc/pacman.d/hooks
sudo tee /etc/pacman.d/hooks/90-suid-cleanup.hook > /dev/null << 'EOF'
[Trigger]
Type = Path
Operation = Install
Operation = Upgrade
Target = usr/bin/chfn
Target = usr/bin/chsh

[Action]
Description = Retirando bit SUID de binarios no necesarios...
When = PostTransaction
Exec = /usr/bin/chmod u-s /usr/bin/chfn /usr/bin/chsh
EOF
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>[Trigger]</code>: define cuándo se ejecuta el hook. En este caso, después de instalar o actualizar los paquetes que contienen <code>chfn</code> o <code>chsh</code>.</li>
<li><code>[Action]</code>: define qué hace. Ejecuta el <code>chmod</code> para quitar el SUID después de que el paquete se haya actualizado.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong><code>pkexec</code> se queda.</strong> Es un binario SUID necesario para que GNOME pueda solicitar privilegios de forma gráfica. Tiene un historial de vulnerabilidades (como PwnKit), pero no hay alternativa práctica si usas GNOME. Anótalo como excepción aceptada y mantén el sistema actualizado.</div>
</div>

<h3 id="tema-2.99.13-3">13.3 Revisar servicios y puertos abiertos</h3>

<p>Antes de aplicar más capas de endurecimiento, conviene hacer una auditoría de lo que está corriendo en el sistema. Este paso sirve para detectar servicios innecesarios que se hayan activado por defecto y para confirmar que no hay nada escuchando en la red que no debería.</p>

<p>Primero, lista los servicios que están en ejecución:</p>

{{< code bash >}}
systemctl list-units --type=service --state=running
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>systemctl list-units</code>: muestra las unidades de systemd actualmente cargadas.</li>
<li><code>--type=service</code>: filtra solo por servicios, excluyendo timers, sockets y otros tipos de unidad.</li>
<li><code>--state=running</code>: muestra solo los que están activos y en ejecución en este momento.</li>
</ul>

<p>En un sistema recién instalado y bien configurado, la lista debe ser corta. En este caso verás <code>iwd</code>, <code>systemd-networkd</code>, <code>systemd-resolved</code>, <code>systemd-journald</code>, <code>dbus</code> y poco más. Si aparece algo que no reconoces, investígalo con <code>systemctl status nombre.service</code> antes de desactivarlo.</p>

<p>Ahora comprueba qué servicios están habilitados para arrancar automáticamente:</p>

{{< code bash >}}
systemctl list-unit-files --state=enabled
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>list-unit-files</code>: lista todos los archivos de unidad instalados en el sistema.</li>
<li><code>--state=enabled</code>: filtra solo los que están configurados para arrancar automáticamente al iniciar el sistema.</li>
</ul>

<p>La diferencia con el comando anterior es importante: un servicio puede estar habilitado (arranca solo) pero no en ejecución (porque ha fallado o se ha detenido), o al revés. Aquí interesa ver todo lo que está habilitado, porque eso es lo que arrancará en el próximo reinicio.</p>

<p>Por último, revisa los puertos de red que están a la escucha:</p>

{{< code bash >}}
ss -tulpn
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>ss</code>: herramienta para inspeccionar sockets de red. Sustituye al antiguo <code>netstat</code>.</li>
<li><code>-t</code>: muestra sockets TCP.</li>
<li><code>-u</code>: muestra sockets UDP.</li>
<li><code>-l</code>: muestra solo los sockets en escucha (<em>listening</em>), no las conexiones establecidas.</li>
<li><code>-p</code>: muestra el proceso asociado a cada socket.</li>
<li><code>-n</code>: muestra direcciones y puertos en formato numérico, sin resolver nombres.</li>
</ul>

<p>En este punto, la salida debe mostrar únicamente <code>systemd-resolved</code> escuchando en <code>127.0.0.53</code> y en <code>127.0.0.54</code>, que son direcciones de loopback (solo accesibles desde el propio equipo). También verás el puerto <code>5353</code> (mDNS) escuchando en todas las interfaces; esto es normal ahora mismo porque <code>systemd-resolved</code> lo activa por defecto y aún no lo hemos desactivado. Lo haremos en el bloque siguiente, al configurar la resolución DNS.</p>

<p>Si aparece cualquier otro puerto escuchando en <code>0.0.0.0</code> o en <code>[::]</code>, investígalo con <code>systemctl status</code> antes de continuar. La política final del sistema es no tener ningún servicio accesible desde la red.</p>

<h3 id="tema-2.99.13-4">13.4 Umask y límites</h3>

<p>La umask define los permisos con los que se crean los archivos nuevos. Por defecto en Arch es <code>022</code>, lo que significa que los archivos se crean legibles por cualquiera. En un sistema monousuario, no hay motivo para eso.</p>

{{< code bash >}}
sudo sed -i 's/^UMASK.*/UMASK\t\t077/' /etc/login.defs
echo "umask 077" | sudo tee /etc/profile.d/99-umask.sh > /dev/null
sudo mkdir -p /etc/systemd/system.conf.d
echo -e "[Manager]\nUMask=0077" | sudo tee /etc/systemd/system.conf.d/umask.conf > /dev/null
sudo chmod 700 /home/*
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>sed -i</code>: edita <code>/etc/login.defs</code> en sitio. El patrón reemplaza la línea que empieza por <code>UMASK</code> por <code>UMASK 077</code>.</li>
<li><code>echo "umask 077" | tee</code>: escribe la línea en un script dentro de <code>/etc/profile.d/</code>, que se ejecuta al iniciar sesión. Así la umask se aplica también a las sesiones interactivas.</li>
<li><code>umask.conf</code>: configuración para systemd. Todos los servicios lanzados por systemd usarán esa umask.</li>
<li><code>chmod 700 /home/*</code>: restringe los directorios personales para que solo el propietario pueda acceder a ellos.</li>
</ul>

<p>Configura también los límites de recursos:</p>

{{< code bash >}}
sudo mkdir -p /etc/security/limits.d/
sudo tee /etc/security/limits.d/99-hardening.conf > /dev/null << 'EOF'
*       hard    core        0
*       soft    core        0
*       hard    nproc       8192
*       hard    nofile      16384
*       hard    maxlogins   3
root    hard    nproc       unlimited
EOF
{{< /code >}}

<p>Qué hace cada línea:</p>

<ul class="step-list">
<li><code>hard core 0</code>: impide que se generen volcados de memoria (core dumps). Un core dump puede contener contraseñas o claves en memoria.</li>
<li><code>soft core 0</code>: aplica el mismo límite como valor por defecto.</li>
<li><code>nproc 8192</code>: limita el número de procesos que un usuario puede crear. Un valor muy bajo rompería contenedores y VMs, pero 8192 es holgado.</li>
<li><code>nofile 16384</code>: limita el número de descriptores de archivo abiertos simultáneamente. Las bases de datos y los contenedores abren muchos.</li>
<li><code>maxlogins 3</code>: limita a tres las sesiones simultáneas por usuario. Suficiente para uso normal, disuade ataques de fuerza bruta que intenten abrir muchas sesiones.</li>
<li><code>root hard nproc unlimited</code>: exime a root del límite de procesos, para que nunca se quede sin poder lanzar tareas del sistema.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Los valores son más altos que en guías genéricas.</strong> Con 8192 procesos y 16384 descriptores, tienes margen suficiente para ejecutar varias máquinas virtuales y contenedores a la vez sin tocar los límites. En un servidor pequeño o en un equipo de escritorio sin virtualización, valores menores serían suficientes, pero aquí no queremos cuellos de botella.</div>
</div>

</div>
</section>
<section class="tema-section" id="tema-2.99.14">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.14</span> Kernel y controles de seguridad (Fase 2)
</h2>
<div class="tema-content">

<p>En esta fase se ajustan los parámetros del kernel, se restringe la carga de módulos innecesarios y se activan los perfiles de AppArmor. Todo lo que se aplica aquí reduce la superficie de ataque del sistema en tiempo de ejecución, sin tocar el arranque ni el cifrado.</p>

<h3 id="tema-2.99.14-1">14.1 Parámetros del kernel con sysctl</h3>

<p>Los parámetros <code>sysctl</code> permiten modificar el comportamiento del kernel en caliente. Se agrupan en archivos dentro de <code>/etc/sysctl.d/</code> para que se apliquen al arrancar y sean fáciles de mantener.</p>

<p>Crea el archivo principal con los ajustes de seguridad:</p>

{{< code bash >}}
sudo tee /etc/sysctl.d/99-hardening.conf > /dev/null << 'EOF'
# Exposicion de informacion
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
kernel.printk = 3 3 3 3
kernel.perf_event_paranoid = 3

# Depuracion y trazas
kernel.yama.ptrace_scope = 1
kernel.sysrq = 4

# Carga de codigo
kernel.kexec_load_disabled = 1

# BPF sin privilegios
kernel.unprivileged_bpf_disabled = 1
net.core.bpf_jit_harden = 2

# userfaultfd
vm.unprivileged_userfaultfd = 0

# Volcados de memoria
kernel.core_pattern = |/bin/false
fs.suid_dumpable = 0

# Proteccion de enlaces
fs.protected_symlinks = 1
fs.protected_hardlinks = 1
fs.protected_fifos = 2
fs.protected_regular = 2

# Varios
kernel.randomize_va_space = 2
dev.tty.ldisc_autoload = 0
vm.mmap_rnd_bits = 32
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>kernel.kptr_restrict = 2</code>: oculta las direcciones del kernel en <code>/proc/kallsyms</code> y en otros sitios, incluso para root. Dificulta exploits que necesitan conocer direcciones de memoria del kernel.</li>
<li><code>kernel.dmesg_restrict = 1</code>: impide que usuarios sin privilegios lean el buffer de mensajes del kernel (<code>dmesg</code>). Evita fugas de información sobre el hardware y el arranque.</li>
<li><code>kernel.printk = 3 3 3 3</code>: limita los mensajes que van a consola. Reduce el ruido y evita que información sensible se muestre en pantallas compartidas.</li>
<li><code>kernel.perf_event_paranoid = 3</code>: restringe el uso de <code>perf_event_open</code>, que permite monitorizar el rendimiento del sistema y, en manos maliciosas, extraer información de otros procesos.</li>
<li><code>kernel.yama.ptrace_scope = 1</code>: limita <code>ptrace</code> a procesos hijos. Impide que un proceso lea la memoria de otro del mismo usuario. Es el valor recomendado para depurar scripts sin abrir la puerta a ataques entre procesos.</li>
<li><code>kernel.sysrq = 4</code>: limita las combinaciones de teclas SysRq a las de solo lectura. Evita que alguien pueda reiniciar o volcar memoria con combinaciones de teclado.</li>
<li><code>kernel.kexec_load_disabled = 1</code>: desactiva <code>kexec</code>, que permite cargar un kernel alternativo sin reiniciar. Es un vector clásico para saltarse Secure Boot. Como usamos lockdown, esta opción refuerza la protección.</li>
<li><code>kernel.unprivileged_bpf_disabled = 1</code>: impide que usuarios sin privilegios carguen programas BPF. Cierra un vector de ataque del kernel.</li>
<li><code>net.core.bpf_jit_harden = 2</code>: endurece el compilador JIT de BPF. Añade aleatorización y comprobaciones extra para dificultar exploits.</li>
<li><code>vm.unprivileged_userfaultfd = 0</code>: desactiva <code>userfaultfd</code> para usuarios sin privilegios. Es un mecanismo que se ha usado en exploits de kernel recientes.</li>
<li><code>kernel.core_pattern = |/bin/false</code>: cuando un proceso recibe una señal de fallo, en lugar de generar un volcado en disco, redirige la salida a <code>/bin/false</code>, que no hace nada. Evita que datos sensibles de la memoria acaben en archivos de volcado.</li>
<li><code>fs.suid_dumpable = 0</code>: impide que los binarios con SUID generen volcados de memoria.</li>
<li><code>fs.protected_symlinks = 1</code>: evita ataques de enlaces simbólicos en directorios compartidos como <code>/tmp</code>.</li>
<li><code>fs.protected_hardlinks = 1</code>: evita ataques de enlaces duros a archivos que no te pertenecen.</li>
<li><code>fs.protected_fifos = 2</code>: protege las tuberías (FIFO) frente a escrituras no autorizadas.</li>
<li><code>fs.protected_regular = 2</code>: protege los archivos regulares en directorios compartidos.</li>
<li><code>kernel.randomize_va_space = 2</code>: activa la aleatorización completa del espacio de direcciones (ASLR).</li>
<li><code>dev.tty.ldisc_autoload = 0</code>: impide que se carguen dinámicamente disciplinas de línea de terminal. Reduce superficie de ataque.</li>
<li><code>vm.mmap_rnd_bits = 32</code>: aumenta los bits de aleatorización en <code>mmap</code>. Hace más difícil predecir direcciones de memoria.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Sobre <code>ptrace_scope = 1</code>:</strong> no se usa <code>2</code> ni <code>3</code> porque romperían la depuración de scripts de Python o Bash. El valor <code>1</code> ya cierra el vector real: un proceso no puede inspeccionar la memoria de otro que no sea su hijo.</div>
</div>

<p>Ahora los parámetros de red:</p>

{{< code bash >}}
sudo tee /etc/sysctl.d/99-network.conf > /dev/null << 'EOF'
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_rfc1337 = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv6.conf.all.use_tempaddr = 2
net.ipv6.conf.default.use_tempaddr = 2
EOF
{{< /code >}}

<p>Qué hace cada parámetro:</p>

<ul class="step-list">
<li><code>tcp_syncookies = 1</code>: activa las cookies SYN para mitigar ataques de denegación de servicio por inundación SYN.</li>
<li><code>tcp_rfc1337 = 1</code>: protección contra ataques de tipo TIME_WAIT.</li>
<li><code>rp_filter = 1</code>: activa el filtrado de rutas inverso. Evita paquetes con direcciones IP falsificadas.</li>
<li><code>accept_redirects = 0</code> (IPv4 e IPv6): ignora los mensajes ICMP de redirección. Evita que un atacante redirija el tráfico.</li>
<li><code>send_redirects = 0</code>: no envía redirecciones ICMP. El equipo no actúa como router.</li>
<li><code>accept_source_route = 0</code>: ignora las rutas de origen especificadas en los paquetes.</li>
<li><code>log_martians = 1</code>: registra los paquetes con direcciones imposibles. Útil para detectar escaneos.</li>
<li><code>icmp_echo_ignore_broadcasts = 1</code>: ignora peticiones de eco ICMP dirigidas a direcciones de broadcast. Evita que el equipo responda a ataques de amplificación.</li>
<li><code>icmp_ignore_bogus_error_responses = 1</code>: ignora respuestas ICMP de error mal formadas.</li>
<li><code>use_tempaddr = 2</code>: usa direcciones IPv6 temporales para conexiones salientes. Dificulta el seguimiento.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>No se desactiva IPv6.</strong> Es un antipatrón habitual pero rompe compatibilidad con muchas redes modernas. Los parámetros anteriores ya mitigan los riesgos asociados.</div>
</div>

<p>Aplica todos los cambios:</p>

{{< code bash >}}
sudo sysctl --system
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sysctl --system</code>: lee y aplica todos los archivos de configuración de <code>/etc/sysctl.d/</code> y <code>/etc/sysctl.conf</code>. Muestra por pantalla cada parámetro aplicado.</li>
</ul>

<p>Desactiva también los volcados de memoria del sistema:</p>

{{< code bash >}}
sudo mkdir -p /etc/systemd/coredump.conf.d
sudo tee /etc/systemd/coredump.conf.d/disable.conf > /dev/null << 'EOF'
[Coredump]
Storage=none
ProcessSizeMax=0
EOF
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>Storage=none</code>: no guarda ningún volcado de memoria.</li>
<li><code>ProcessSizeMax=0</code>: no permite que se generen volcados de ningún tamaño.</li>
</ul>

<h3 id="tema-2.99.14-2">14.2 Bloquear módulos innecesarios</h3>

<p>No se trata de bloquear todo indiscriminadamente, sino solo aquellos módulos que no se usan y que amplían la superficie de ataque. La lista es concreta:</p>

{{< code bash >}}
sudo tee /etc/modprobe.d/blacklist-hardening.conf > /dev/null << 'EOF'
# Sistemas de ficheros poco auditados
install cramfs /bin/true
install freevxfs /bin/true
install jffs2 /bin/true
install hfs /bin/true
install hfsplus /bin/true
install udf /bin/true

# Protocolos de red obsoletos
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
install n-hdlc /bin/true
install ax25 /bin/true
install netrom /bin/true
install x25 /bin/true
install rose /bin/true
install decnet /bin/true
install econet /bin/true
install ipx /bin/true
install appletalk /bin/true
install psnap /bin/true
install p8023 /bin/true
install p8022 /bin/true
install can /bin/true
install atm /bin/true

# Buses con acceso DMA que no tienes
install firewire-core /bin/true
install firewire-ohci /bin/true
install thunderbolt /bin/true

# Bluetooth (mismo chip AX200, pero dispositivo USB aparte)
install btusb /bin/true
EOF
{{< /code >}}

<p>Qué hace cada línea:</p>

<ul class="step-list">
<li><code>install modulo /bin/true</code>: le dice al kernel que, en lugar de cargar el módulo, ejecute <code>/bin/true</code>, que no hace nada. Es la forma correcta de bloquear un módulo: no se carga pero tampoco da error.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>Módulos que NO se bloquean y por qué:</strong>
<ul class="step-list">
<li><code>squashfs</code>: lo necesitan las imágenes de contenedor y los AppImage.</li>
<li><code>overlay</code>: es el sistema de ficheros que usa Podman.</li>
<li><code>thunderbolt</code>: sí se bloquea porque el diagnóstico confirmó que no hay controlador Thunderbolt. Si algún día se conecta un dock USB-C con TB, quitar esa línea.</li>
<li><code>btusb</code>: se bloquea, pero si se quieren usar auriculares Bluetooth, quitar la línea y usar <code>rfkill block bluetooth</code>.</li>
</ul>
</div>
</div>

<p>Regenera la initramfs para que los cambios en <code>modprobe.d</code> se apliquen desde el arranque:</p>

{{< code bash >}}
sudo mkinitcpio -P
sudo sbctl verify
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>mkinitcpio -P</code>: regenera las UKI con la nueva configuración de módulos. El hook <code>modconf</code> incluye los archivos de <code>/etc/modprobe.d/</code> en la initramfs.</li>
<li><code>sbctl verify</code>: comprueba que las UKI siguen firmadas correctamente después de regenerarlas.</li>
</ul>

<h3 id="tema-2.99.14-3">14.3 AppArmor con perfiles reales</h3>

<p>AppArmor ya está activo (lo vimos en el bloque anterior). Lo que falta es cargar perfiles útiles. En este punto, la mayoría de procesos no están confinados, así que la protección real es mínima.</p>

<p>Comprueba el estado actual:</p>

{{< code bash >}}
sudo aa-status
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>aa-status</code>: muestra información sobre AppArmor: si está activo, cuántos perfiles hay cargados, cuántos procesos están confinados y en qué modo (enforce o complain).</li>
</ul>

<p>El número que importa es <strong>procesos confinados</strong>, no perfiles cargados. Un perfil cargado no sirve de nada si no hay procesos que lo usen.</p>

<p>Los perfiles a poner en <code>enforce</code> por orden de exposición son: navegador, cliente de correo y lector de PDF. Para ellos, se pueden usar los perfiles que vienen en el paquete <code>apparmor</code> o crearlos con <code>aa-genprof</code>.</p>

{{< code bash >}}
sudo aa-status | grep -E "processes are in (enforce|complain)"
{{< /code >}}

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>Es normal que en este punto aparezca <code>0</code> en ambas líneas.</strong> El paquete base <code>apparmor</code> en Arch solo proporciona el motor de seguridad, no perfiles predefinidos. Además, todavía no hemos instalado aplicaciones que merezcan ser confinadas. Los perfiles se añadirán más adelante, cuando el sistema tenga el entorno gráfico y el navegador instalados.</div>
</div>

<p>Qué hace:</p>

<ul class="step-list">
<li>Filtra la salida de <code>aa-status</code> para mostrar solo cuántos procesos están en modo <code>enforce</code> (bloqueando) y cuántos en <code>complain</code> (solo registrando).</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>No aplicar perfiles de AppArmor a <code>podman</code>, <code>crun</code> ni <code>qemu</code> sin entender bien lo que se hace.</strong> Confinar el runtime de contenedores rompe el aislamiento en lugar de reforzarlo. Podman ya aplica su propio perfil <code>containers-default</code> a los procesos de dentro. Lo mismo aplica a <code>libvirtd</code> y sus servicios asociados.</div>
</div>

</div>
</section>

<section class="tema-section" id="tema-2.99.15">
<h2 class="tema-section-title">
<span class="tema-section-code">2.99.15</span> Usuarios y privilegios (Fase 3)
</h2>
<div class="tema-content">

<p>En esta fase se endurece la gestión de privilegios: se configura <code>sudo</code> con opciones seguras, se aplican políticas de contraseñas y bloqueo de cuentas, y se deshabilita la cuenta de root. Es una fase delicada porque un error en la configuración de PAM o sudo puede dejarte fuera del sistema.</p>

<div class="callout callout-danger">
<span class="callout-icon">🚨</span>
<div class="callout-body"><strong>Antes de empezar, abre una segunda terminal como root (Ctrl+Alt+F2, inicia sesión como root) y no la cierres hasta terminar esta fase.</strong> Si cometes un error en la configuración de sudo o PAM, esa terminal te permitirá corregirlo sin tener que arrancar desde el USB. Una vez que todo funcione, puedes cerrarla.</div>
</div>

<h3 id="tema-2.99.15-1">15.1 Verificar sudo antes de tocar nada</h3>

<p>Comprueba que <code>sudo</code> funciona correctamente con tu usuario antes de hacer cambios:</p>

{{< code bash >}}
sudo -v && echo "sudo OK"
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>sudo -v</code>: actualiza el timestamp de sudo. Si tu usuario tiene permisos, pedirá la contraseña y la validará durante unos minutos.</li>
<li><code>&& echo "sudo OK"</code>: solo se ejecuta si el comando anterior ha tenido éxito. Si ves "sudo OK", todo está bien.</li>
</ul>

<p>Si esto falla, no continúes. Revisa que tu usuario esté en el grupo <code>wheel</code> y que la línea <code>%wheel ALL=(ALL:ALL) ALL</code> esté descomentada en <code>/etc/sudoers</code>. Si no puedes arreglarlo, usa la terminal root que abriste al principio.</p>

<h3 id="tema-2.99.15-2">15.2 Bloquear la cuenta de root</h3>

<p>Una vez confirmado que <code>sudo</code> funciona, se puede bloquear la cuenta de root. Esto impide el inicio de sesión directo como root y obliga a usar <code>sudo</code> con tu usuario, lo que deja un registro de las acciones.</p>

{{< code bash >}}
sudo passwd -l root
sudo passwd -S root
{{< /code >}}

<p>Qué hace cada uno:</p>

<ul class="step-list">
<li><code>passwd -l root</code>: bloquea la cuenta de root añadiendo un <code>!</code> al principio del hash de la contraseña en <code>/etc/shadow</code>. El login como root queda deshabilitado.</li>
<li><code>passwd -S root</code>: muestra el estado de la cuenta. Debe aparecer una <code>L</code> (Locked) en la segunda columna.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>No bloquees root antes de verificar que sudo funciona.</strong> Si sudo falla y root está bloqueado, te quedarás fuera del sistema. La segunda terminal root que abriste al principio es tu red de seguridad.</div>
</div>

<h3 id="tema-2.99.15-3">15.3 Configurar sudo con opciones seguras</h3>

<p>Ahora se añaden opciones de seguridad a sudo. En lugar de editar el archivo principal, se usa un archivo dentro de <code>/etc/sudoers.d/</code> para mantener las personalizaciones separadas:</p>

{{< code bash >}}
sudo EDITOR=vim visudo -f /etc/sudoers.d/99-hardening
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>visudo -f</code>: edita un archivo específico con la validación de sintaxis de visudo. Si cometes un error, no guardará los cambios.</li>
<li><code>EDITOR=vim</code>: fuerza a visudo a usar vim en lugar del editor por defecto.</li>
</ul>

<p>Añade el siguiente contenido:</p>

{{< code bash >}}
Defaults    use_pty
Defaults    logfile="/var/log/sudo.log"
Defaults    log_input, log_output
Defaults    iolog_dir="/var/log/sudo-io/%{user}"
Defaults    timestamp_timeout=5
Defaults    passwd_timeout=1
Defaults    passwd_tries=3
Defaults    !visiblepw
Defaults    always_set_home
Defaults    env_reset
Defaults    secure_path="/usr/local/sbin:/usr/local/bin:/usr/bin"
Defaults    lecture=once
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>use_pty</code>: obliga a que los comandos se ejecuten en una pseudo-terminal propia. Evita que un proceso malicioso que sobreviva a sudo se quede con tu terminal para inyectar comandos.</li>
<li><code>logfile="/var/log/sudo.log"</code>: registra los comandos de sudo en un archivo aparte.</li>
<li><code>log_input, log_output</code>: graba la entrada y la salida de los comandos ejecutados con sudo. Permite auditar exactamente qué se hizo.</li>
<li><code>iolog_dir</code>: directorio donde se guardan los registros de entrada/salida, organizados por usuario.</li>
<li><code>timestamp_timeout=5</code>: los privilegios de sudo caducan a los 5 minutos. Evita que una sesión desatendida mantenga privilegios indefinidamente.</li>
<li><code>passwd_timeout=1</code>: espera un minuto como máximo para introducir la contraseña.</li>
<li><code>passwd_tries=3</code>: permite tres intentos antes de fallar.</li>
<li><code>!visiblepw</code>: no muestra la contraseña mientras se escribe.</li>
<li><code>always_set_home</code>: establece <code>HOME</code> al directorio del usuario que ejecuta sudo.</li>
<li><code>env_reset</code>: limpia las variables de entorno antes de ejecutar el comando. Evita que variables maliciosas afecten al comando con privilegios.</li>
<li><code>secure_path</code>: define un PATH seguro para los comandos ejecutados con sudo.</li>
<li><code>lecture=once</code>: muestra el mensaje de advertencia de sudo solo la primera vez.</li>
</ul>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><strong>No se añade <code>requiretty</code>.</strong> Esa opción rompe los scripts que llaman a sudo sin terminal, algo que haremos en fases posteriores. <code>use_pty</code> ya proporciona la protección que importa.</div>
</div>

<p>Restringe también el uso de <code>su</code> al grupo <code>wheel</code>. Edita los archivos de PAM:</p>

{{< code bash >}}
sudo vim /etc/pam.d/su
{{< /code >}}

<p>Busca la línea:</p>

{{< code bash >}}
# auth        required    pam_wheel.so use_uid
{{< /code >}}

<p>Y descoméntala (quita el <code>#</code>). Haz lo mismo en <code>/etc/pam.d/su-l</code>:</p>

{{< code bash >}}
sudo vim /etc/pam.d/su-l
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>pam_wheel.so use_uid</code>: solo los usuarios del grupo <code>wheel</code> pueden usar <code>su</code> para cambiar a otro usuario (incluido root). Refuerza el control de privilegios.</li>
</ul>

<h3 id="tema-2.99.15-4">15.4 Política de contraseñas con libpwquality</h3>

<p>Instala <code>libpwquality</code> para aplicar reglas de complejidad a las contraseñas:</p>

{{< code bash >}}
sudo pacman -S libpwquality
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>libpwquality</code>: biblioteca que proporciona comprobaciones de calidad de contraseñas. Se integra con PAM para rechazar contraseñas débiles al cambiarlas.</li>
</ul>

<p>Configura las reglas:</p>

{{< code bash >}}
sudo vim /etc/security/pwquality.conf
{{< /code >}}

<p>Deja el archivo así:</p>

{{< code bash >}}
minlen = 12
minclass = 3
maxrepeat = 3
maxsequence = 4
dictcheck = 1
usercheck = 1
enforcing = 1
retry = 3
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>minlen = 12</code>: longitud mínima de 12 caracteres.</li>
<li><code>minclass = 3</code>: exige al menos tres tipos de caracteres distintos (mayúsculas, minúsculas, dígitos, símbolos).</li>
<li><code>maxrepeat = 3</code>: no permite más de tres caracteres idénticos consecutivos.</li>
<li><code>maxsequence = 4</code>: no permite secuencias de más de cuatro caracteres (por ejemplo, <code>abcd</code> o <code>1234</code>).</li>
<li><code>dictcheck = 1</code>: comprueba que la contraseña no esté en un diccionario de contraseñas comunes.</li>
<li><code>usercheck = 1</code>: rechaza contraseñas que contengan el nombre de usuario.</li>
<li><code>enforcing = 1</code>: aplica las reglas de forma obligatoria.</li>
<li><code>retry = 3</code>: permite tres intentos antes de fallar el cambio de contraseña.</li>
</ul>

<h3 id="tema-2.99.15-5">15.5 Bloqueo de cuentas con faillock</h3>

<p>Configura <code>faillock</code> para bloquear cuentas tras varios intentos fallidos de inicio de sesión:</p>

{{< code bash >}}
sudo vim /etc/security/faillock.conf
{{< /code >}}

<p>Añade o modifica:</p>

{{< code bash >}}
deny = 5
fail_interval = 900
unlock_time = 600
even_deny_root
root_unlock_time = 600
audit
silent
{{< /code >}}

<p>Qué hace cada opción:</p>

<ul class="step-list">
<li><code>deny = 5</code>: bloquea la cuenta tras cinco intentos fallidos.</li>
<li><code>fail_interval = 900</code>: cuenta los intentos fallidos en una ventana de 15 minutos.</li>
<li><code>unlock_time = 600</code>: desbloquea automáticamente después de 10 minutos.</li>
<li><code>even_deny_root</code>: aplica las reglas también a root.</li>
<li><code>root_unlock_time = 600</code>: tiempo de desbloqueo para root.</li>
<li><code>audit</code>: registra los bloqueos en el sistema de auditoría.</li>
<li><code>silent</code>: no informa al usuario sobre el bloqueo (dificulta la enumeración de usuarios).</li>
</ul>

<p>Comprueba que las líneas de <code>faillock</code> están activas en PAM:</p>

{{< code bash >}}
grep faillock /etc/pam.d/system-auth
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Busca las líneas que hacen referencia a <code>faillock</code> en el archivo de autenticación del sistema. Deben aparecer al menos dos: una con <code>preauth</code> y otra con <code>authfail</code>.</li>
</ul>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body"><strong>No edites <code>system-auth</code> a ciegas.</strong> Lo gestiona el paquete <code>pam</code> y un error puede bloquear el login local y el gráfico a la vez. Si necesitas hacer cambios, usa los archivos de <code>/etc/security/</code> y deja que PAM los lea.</div>
</div>

<p>Prueba el sistema de bloqueo desde la terminal root que dejaste abierta:</p>

{{< code bash >}}
faillock --user cambiame
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Muestra los intentos fallidos registrados para el usuario. Si no hay ninguno, aparecerá la lista vacía.</li>
</ul>

{{< code bash >}}
faillock --user cambiame --reset
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Reinicia el contador de intentos fallidos para ese usuario.</li>
</ul>

<h3 id="tema-2.99.15-6">15.6 Algoritmo de hash de contraseñas</h3>

<p>Verifica que el sistema usa <code>yescrypt</code> como algoritmo de hash para las contraseñas. Es el más moderno y resistente a ataques con GPU:</p>

{{< code bash >}}
grep -E "^ENCRYPT_METHOD" /etc/login.defs
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Busca la línea que define el método de cifrado de contraseñas. Debe mostrar <code>ENCRYPT_METHOD YESCRYPT</code>.</li>
</ul>

<p>Regenera el hash de tu contraseña para que se aplique el algoritmo actual:</p>

{{< code bash >}}
sudo passwd cambiame
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li><code>passwd</code>: cambia la contraseña del usuario. Al introducir la nueva, se generará un hash con el método configurado.</li>
</ul>

<p>Comprueba que el hash usa yescrypt:</p>

{{< code bash >}}
sudo awk -F: '$2 ~ /^\$y\$/ {print $1": yescrypt OK"}' /etc/shadow
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Busca en <code>/etc/shadow</code> los hashes que empiezan por <code>$y$</code>, que es el prefijo de yescrypt. Si aparece tu usuario con "yescrypt OK", el cambio se ha aplicado correctamente.</li>
</ul>

<h3 id="tema-2.99.15-7">15.7 Comprobación final</h3>

<p>Antes de cerrar la terminal root de seguridad, verifica que puedes iniciar sesión con tu usuario y que sudo sigue funcionando:</p>

{{< code bash >}}
sudo -v && echo "sudo OK"
{{< /code >}}

<p>Qué hace:</p>

<ul class="step-list">
<li>Vuelve a validar sudo. Debe pedirte la contraseña y funcionar sin problemas.</li>
</ul>

<p>Si todo está correcto, puedes cerrar la terminal root (escribe <code>exit</code>). A partir de ahora, toda la administración se hará desde tu usuario con <code>sudo</code>.</p>

</div>
</section>