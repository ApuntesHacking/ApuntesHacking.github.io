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

CONTINUARÁ.....

</div>
</section>