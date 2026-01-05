// Inicializar partículas en el fondo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar partículas
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#6c5ce7" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 100,
                    color: "#6c5ce7",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            }
        });
    }
    
    // Tool content templates
    const toolTemplates = {
        'code-converter': getCodeConverterTemplate(),
        'shader-converter': getShaderConverterTemplate(),
        'color-palette': getColorPaletteTemplate(),
        'json-formatter': getJsonFormatterTemplate(),
        'balance-calculator': getBalanceCalculatorTemplate(),
        'name-generator': getNameGeneratorTemplate(),
        'pixel-art-editor': getPixelArtEditorTemplate()
    };
    
    // Tool data
    const toolData = {
        nameParts: {
            character: {
                prefixes: ['Sir', 'Lady', 'Captain', 'General', 'King', 'Queen', 'Lord', 'Master', 'Doctor', 'Professor'],
                names: ['Arthur', 'Morgan', 'Eleanor', 'Victor', 'Isabella', 'Marcus', 'Lilith', 'Gideon', 'Serena', 'Orion'],
                suffixes: ['the Brave', 'the Wise', 'the Strong', 'the Merciful', 'the Just', 'the Fearless', 'the Cunning', 'the Blessed']
            },
            location: {
                prefixes: ['Dark', 'Shadow', 'Crystal', 'Iron', 'Golden', 'Silver', 'Emerald', 'Sapphire', 'Blood', 'Frost'],
                names: ['Forest', 'Mountain', 'Keep', 'Castle', 'Cavern', 'River', 'Valley', 'Citadel', 'Tower', 'Realm'],
                suffixes: ['of Doom', 'of Hope', 'of Legends', 'of Eternity', 'of Shadows', 'of Light', 'of the Ancients']
            }
        },
        
        hexToRgb: function(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : {r: 108, g: 92, b: 231};
        },
        
        rgbToHex: function(rgb) {
            return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
        },
        
        getComplementaryColor: function(rgb) {
            return {
                r: 255 - rgb.r,
                g: 255 - rgb.g,
                b: 255 - rgb.b
            };
        },
        
        adjustLightness: function(rgb, factor) {
            return {
                r: Math.min(255, Math.max(0, Math.floor(rgb.r * factor))),
                g: Math.min(255, Math.max(0, Math.floor(rgb.g * factor))),
                b: Math.min(255, Math.max(0, Math.floor(rgb.b * factor)))
            };
        }
    };
    
    // Initialize the page
    initializePage();
    
    function initializePage() {
        // Botón volver arriba
        const backToTopBtn = document.querySelector('.back-to-top');
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
            
            // Actualizar navegación activa
            updateActiveNav();
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Navegación suave
        document.querySelectorAll('nav a, .nav-link').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                        
                        // Actualizar navegación activa
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                }
            });
        });
        
        // Botones de comunidad
        document.getElementById('join-community').addEventListener('click', function() {
            document.getElementById('comunidad').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('join-discord').addEventListener('click', function() {
            showNotification('Redirigiendo a Discord...', 'info');
            setTimeout(() => {
                window.open('https://chat.whatsapp.com/JcY0POfbDFOIgL9oX9VmMN', '_blank');
            }, 1000);
        });
        
        // Tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        const toolContentArea = document.getElementById('tool-content-area');
        
        toolCards.forEach(card => {
            const openBtn = card.querySelector('.open-tool-btn');
            openBtn.addEventListener('click', function() {
                const toolId = card.getAttribute('data-tool');
                openTool(toolId);
            });
            
            // Animación en scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate__fadeInUp');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
        
        // Community features animation
        const communityFeatures = document.querySelectorAll('.community-feature');
        communityFeatures.forEach(feature => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(feature);
        });
    }
    
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id], h3[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    function openTool(toolId) {
        const toolContentArea = document.getElementById('tool-content-area');
        
        if (toolTemplates[toolId]) {
            toolContentArea.innerHTML = toolTemplates[toolId];
            toolContentArea.classList.add('active');
            
            // Scroll a la herramienta
            toolContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Botón cerrar
            const closeBtn = toolContentArea.querySelector('.close-tool');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    toolContentArea.classList.remove('active');
                });
            }
            
            // Inicializar funcionalidad específica
            initTool(toolId);
        } else {
            toolContentArea.innerHTML = `
                <div class="tool-header">
                    <h2>Herramienta en desarrollo</h2>
                    <button class="close-tool"><i class="fas fa-times"></i></button>
                </div>
                <div class="tool-content-body">
                    <p>Esta herramienta está actualmente en desarrollo. ¡Pronto estará disponible!</p>
                    <p>Mientras tanto, puedes explorar nuestras otras herramientas.</p>
                </div>
            `;
            toolContentArea.classList.add('active');
            
            const closeBtn = toolContentArea.querySelector('.close-tool');
            closeBtn.addEventListener('click', function() {
                toolContentArea.classList.remove('active');
            });
        }
    }
    
    function initTool(toolId) {
        switch(toolId) {
            case 'code-converter':
                initCodeConverter();
                break;
            case 'shader-converter':
                initShaderConverter();
                break;
            case 'color-palette':
                initColorPalette();
                break;
            case 'json-formatter':
                initJsonFormatter();
                break;
            case 'balance-calculator':
                initBalanceCalculator();
                break;
            case 'name-generator':
                initNameGenerator();
                break;
            case 'pixel-art-editor':
                initPixelArtEditor();
                break;
        }
    }
    
    // Funciones de plantillas
    function getCodeConverterTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-exchange-alt"></i> Conversor de Código</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label>Lenguaje/Motor de Origen:</label>
                <select id="source-language">
                    <option value="csharp">C# (Unity)</option>
                    <option value="cpp">C++ (Unreal)</option>
                    <option value="gdscript">GDScript (Godot)</option>
                    <option value="javascript">JavaScript (Web)</option>
                    <option value="python">Python (Pygame)</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label>Lenguaje/Motor de Destino:</label>
                <select id="target-language">
                    <option value="cpp">C++ (Unreal)</option>
                    <option value="csharp">C# (Unity)</option>
                    <option value="gdscript">GDScript (Godot)</option>
                    <option value="javascript">JavaScript (Web)</option>
                    <option value="python">Python (Pygame)</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label>Código de Entrada:</label>
                <div class="code-editor">
                    <div class="code-header">
                        <span id="source-language-name">C# (Unity)</span>
                        <div class="code-actions">
                            <button class="code-action-btn" id="clear-code"><i class="fas fa-trash"></i> Limpiar</button>
                            <button class="code-action-btn" id="sample-code"><i class="fas fa-code"></i> Ejemplo</button>
                        </div>
                    </div>
                    <textarea class="code-area" id="input-code" placeholder="Escribe o pega tu código aquí..."></textarea>
                </div>
            </div>
            <div class="btn-group">
                <button class="tool-btn" id="convert-code"><i class="fas fa-exchange-alt"></i> Convertir Código</button>
                <button class="tool-btn btn-secondary" id="copy-result"><i class="fas fa-copy"></i> Copiar Resultado</button>
                <button class="tool-btn btn-secondary" id="download-code"><i class="fas fa-download"></i> Descargar</button>
            </div>
            <div class="tool-input-group">
                <label>Código Convertido:</label>
                <div class="code-editor">
                    <div class="code-header">
                        <span id="target-language-name">C++ (Unreal)</span>
                        <div class="code-actions">
                            <button class="code-action-btn" id="clear-result"><i class="fas fa-trash"></i> Limpiar</button>
                        </div>
                    </div>
                    <textarea class="code-area" id="output-code" readonly></textarea>
                </div>
            </div>
        `;
    }
    
    function getShaderConverterTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-exchange-alt"></i> Conversor de Shaders</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label>Lenguaje de Shader de Origen:</label>
                <select id="source-shader">
                    <option value="hlsl">HLSL (DirectX/Unreal)</option>
                    <option value="glsl">GLSL (OpenGL/WebGL)</option>
                    <option value="cg">CG (Unity Legacy)</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label>Lenguaje de Shader de Destino:</label>
                <select id="target-shader">
                    <option value="glsl">GLSL (OpenGL/WebGL)</option>
                    <option value="hlsl">HLSL (DirectX/Unreal)</option>
                    <option value="cg">CG (Unity Legacy)</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label>Tipo de Shader:</label>
                <select id="shader-type">
                    <option value="vertex">Vertex Shader</option>
                    <option value="fragment">Fragment/Pixel Shader</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label>Shader de Entrada:</label>
                <div class="code-editor">
                    <div class="code-header">
                        <span id="source-shader-name">HLSL (DirectX/Unreal)</span>
                        <div class="code-actions">
                            <button class="code-action-btn" id="clear-shader"><i class="fas fa-trash"></i> Limpiar</button>
                            <button class="code-action-btn" id="sample-shader"><i class="fas fa-code"></i> Ejemplo</button>
                        </div>
                    </div>
                    <textarea class="code-area" id="input-shader" placeholder="Escribe o pega tu shader aquí..."></textarea>
                </div>
            </div>
            <div class="btn-group">
                <button class="tool-btn" id="convert-shader"><i class="fas fa-exchange-alt"></i> Convertir Shader</button>
                <button class="tool-btn btn-secondary" id="copy-shader"><i class="fas fa-copy"></i> Copiar Resultado</button>
            </div>
            <div class="tool-input-group">
                <label>Shader Convertido:</label>
                <div class="code-editor">
                    <div class="code-header">
                        <span id="target-shader-name">GLSL (OpenGL/WebGL)</span>
                        <div class="code-actions">
                            <button class="code-action-btn" id="clear-shader-result"><i class="fas fa-trash"></i> Limpiar</button>
                        </div>
                    </div>
                    <textarea class="code-area" id="output-shader" readonly></textarea>
                </div>
            </div>
        `;
    }
    
    function getColorPaletteTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-palette"></i> Generador de Paletas de Color</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label for="color-base">Color Base (HEX):</label>
                <input type="color" id="color-base" value="#6c5ce7">
                <input type="text" id="color-hex" value="#6c5ce7" style="margin-top: 10px;">
            </div>
            <div class="tool-input-group">
                <label for="palette-type">Esquema de Color:</label>
                <select id="palette-type">
                    <option value="monochromatic">Monocromático</option>
                    <option value="analogous">Análogo</option>
                    <option value="complementary">Complementario</option>
                    <option value="triadic">Triádico</option>
                    <option value="random">Aleatorio</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label for="palette-size">Número de Colores:</label>
                <input type="range" id="palette-size" min="3" max="12" value="5">
                <span id="palette-size-value">5 colores</span>
            </div>
            <button class="tool-btn" id="generate-palette"><i class="fas fa-magic"></i> Generar Paleta</button>
            <div id="palette-result" style="margin-top: 30px;">
                <h3>Tu Paleta de Colores</h3>
                <div class="color-picker-container" id="color-container">
                    <!-- Colors will be generated here -->
                </div>
            </div>
        `;
    }
    
    function getJsonFormatterTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-align-left"></i> Formateador JSON/XML</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label for="json-input">JSON a formatear:</label>
                <textarea id="json-input" placeholder='Pega tu JSON aquí...'>{"game": {"title": "Mi Juego", "version": "1.0", "settings": {"resolution": "1920x1080", "fullscreen": true}}}</textarea>
            </div>
            <div class="btn-group">
                <button class="tool-btn" id="format-json">Formatear JSON</button>
                <button class="tool-btn btn-secondary" id="minify-json">Minificar JSON</button>
                <button class="tool-btn btn-secondary" id="validate-json">Validar JSON</button>
            </div>
            <div class="tool-result" id="json-result"></div>
        `;
    }
    
    function getBalanceCalculatorTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-calculator"></i> Calculadora de Balance</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label for="balance-type">Tipo de Cálculo:</label>
                <select id="balance-type">
                    <option value="damage">Daño de Arma</option>
                    <option value="health">Salud de Enemigo</option>
                    <option value="xp">Experiencia por Nivel</option>
                    <option value="economy">Economía del Juego</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label for="balance-param">Valor Base:</label>
                <input type="number" id="balance-param" value="10">
            </div>
            <div class="tool-input-group">
                <label for="balance-level">Nivel/Máximo:</label>
                <input type="number" id="balance-level" min="1" max="100" value="10">
            </div>
            <div class="tool-input-group">
                <label for="balance-factor">Factor de Escala (%):</label>
                <input type="number" id="balance-factor" min="1" max="500" value="20">
            </div>
            <button class="tool-btn" id="calculate-balance"><i class="fas fa-calculator"></i> Calcular Balance</button>
            <div class="tool-result" id="balance-result"></div>
        `;
    }
    
    function getNameGeneratorTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-font"></i> Generador de Nombres</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label for="name-type">Tipo de Nombre:</label>
                <select id="name-type">
                    <option value="character">Personaje</option>
                    <option value="location">Lugar</option>
                    <option value="weapon">Arma</option>
                    <option value="spell">Hechizo</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label for="name-style">Estilo:</label>
                <select id="name-style">
                    <option value="simple">Simple</option>
                    <option value="epic">Épico</option>
                    <option value="mysterious">Misterioso</option>
                    <option value="ancient">Antiguo</option>
                </select>
            </div>
            <div class="tool-input-group">
                <label for="name-count">Cantidad de Nombres:</label>
                <input type="number" id="name-count" min="1" max="20" value="5">
            </div>
            <button class="tool-btn" id="generate-names"><i class="fas fa-magic"></i> Generar Nombres</button>
            <div class="tool-result" id="names-result"></div>
        `;
    }
    
    function getPixelArtEditorTemplate() {
        return `
            <div class="tool-header">
                <h2><i class="fas fa-pencil-alt"></i> Editor de Pixel Art</h2>
                <button class="close-tool"><i class="fas fa-times"></i></button>
            </div>
            <div class="tool-input-group">
                <label>Herramientas:</label>
                <div class="btn-group">
                    <button class="tool-btn" id="pencil-tool" style="background: var(--primary);"><i class="fas fa-pencil-alt"></i> Lápiz</button>
                    <button class="tool-btn btn-secondary" id="eraser-tool"><i class="fas fa-eraser"></i> Borrador</button>
                    <button class="tool-btn btn-secondary" id="fill-tool"><i class="fas fa-fill-drip"></i> Relleno</button>
                </div>
            </div>
            <div class="tool-input-group">
                <label>Color:</label>
                <input type="color" id="pixel-color" value="#ff0000">
            </div>
            <div class="tool-input-group">
                <label>Tamaño del pincel:</label>
                <input type="range" id="brush-size" min="1" max="10" value="1">
                <span id="brush-size-value">1px</span>
            </div>
            <div class="tool-input-group">
                <label>Canvas:</label>
                <div style="background: #222; padding: 20px; border-radius: 10px; text-align: center;">
                    <canvas id="pixel-canvas" width="320" height="320" style="background: #000; border: 2px solid #444; cursor: crosshair;"></canvas>
                    <div style="margin-top: 10px;">
                        <button class="tool-btn btn-secondary" id="clear-canvas">Limpiar Canvas</button>
                        <button class="tool-btn btn-secondary" id="save-canvas">Guardar Imagen</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Funciones de inicialización de herramientas
    function initCodeConverter() {
        const sourceSelect = document.getElementById('source-language');
        const targetSelect = document.getElementById('target-language');
        const inputCode = document.getElementById('input-code');
        const outputCode = document.getElementById('output-code');
        const sourceName = document.getElementById('source-language-name');
        const targetName = document.getElementById('target-language-name');
        
        function updateLanguageNames() {
            const sourceText = sourceSelect.options[sourceSelect.selectedIndex].text;
            const targetText = targetSelect.options[targetSelect.selectedIndex].text;
            sourceName.textContent = sourceText;
            targetName.textContent = targetText;
        }
        
        sourceSelect.addEventListener('change', updateLanguageNames);
        targetSelect.addEventListener('change', updateLanguageNames);
        updateLanguageNames();
        
        document.getElementById('sample-code').addEventListener('click', function() {
            const lang = sourceSelect.value;
            let sample = '';
            
            if (lang === 'csharp') {
                sample = `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 5.0f;
    public float jumpForce = 10.0f;
    private Rigidbody rb;
    private bool isGrounded = true;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        float moveHorizontal = Input.GetAxis("Horizontal");
        float moveVertical = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);
        rb.AddForce(movement * speed);
        
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
        }
    }
    
    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }
}`;
            } else if (lang === 'cpp') {
                sample = `#include "GameFramework/CharacterMovementComponent.h"

APlayerCharacter::APlayerCharacter()
{
    PrimaryActorTick.bCanEverTick = true;
    
    // Setup movement
    GetCharacterMovement()->JumpZVelocity = 600.f;
    GetCharacterMovement()->AirControl = 0.2f;
}

void APlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    
    PlayerInputComponent->BindAxis("MoveForward", this, &APlayerCharacter::MoveForward);
    PlayerInputComponent->BindAxis("MoveRight", this, &APlayerCharacter::MoveRight);
    PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &APlayerCharacter::StartJump);
}`;
            }
            
            inputCode.value = sample;
        });
        
        document.getElementById('clear-code').addEventListener('click', function() {
            inputCode.value = '';
        });
        
        document.getElementById('clear-result').addEventListener('click', function() {
            outputCode.value = '';
        });
        
        document.getElementById('convert-code').addEventListener('click', function() {
            const sourceLang = sourceSelect.value;
            const targetLang = targetSelect.value;
            const code = inputCode.value;
            
            if (!code.trim()) {
                outputCode.value = "Error: No hay código para convertir.";
                return;
            }
            
            let converted = `// Código convertido de ${sourceLang} a ${targetLang}\n`;
            converted += `// Conversión realizada por GameDev Toolkit Plus\n\n`;
            
            if (sourceLang === 'csharp' && targetLang === 'cpp') {
                converted += `// C++/Unreal versión\n`;
                converted += code.replace(/void Start\(\)/g, 'void BeginPlay()')
                                 .replace(/void Update\(\)/g, 'void Tick(float DeltaTime)')
                                 .replace(/GetComponent<Rigidbody>\(\)/g, 'GetComponentByClass<URigidBodyComponent>()')
                                 .replace(/public float/g, 'UPROPERTY(EditAnywhere)\nfloat')
                                 .replace(/private /g, '');
            } else if (sourceLang === 'cpp' && targetLang === 'csharp') {
                converted += `// C#/Unity versión\n`;
                converted += code.replace(/APlayerCharacter::APlayerCharacter\(\)/g, 'void Start()')
                                 .replace(/void APlayerCharacter::SetupPlayerInputComponent/g, 'void Update()')
                                 .replace(/UPROPERTY\(EditAnywhere\)/g, '[SerializeField]')
                                 .replace(/float /g, 'public float ');
            } else {
                converted += `// Conversión de ${sourceLang} a ${targetLang}\n`;
                converted += `// Nota: La conversión automática puede requerir ajustes manuales\n\n`;
                converted += code;
            }
            
            outputCode.value = converted;
            showNotification('Código convertido exitosamente');
        });
        
        document.getElementById('copy-result').addEventListener('click', function() {
            outputCode.select();
            document.execCommand('copy');
            showNotification('Código copiado al portapapeles');
        });
    }
    
    function initShaderConverter() {
        const sourceSelect = document.getElementById('source-shader');
        const targetSelect = document.getElementById('target-shader');
        const inputShader = document.getElementById('input-shader');
        const outputShader = document.getElementById('output-shader');
        const sourceName = document.getElementById('source-shader-name');
        const targetName = document.getElementById('target-shader-name');
        
        function updateShaderNames() {
            const sourceText = sourceSelect.options[sourceSelect.selectedIndex].text;
            const targetText = targetSelect.options[targetSelect.selectedIndex].text;
            sourceName.textContent = sourceText;
            targetName.textContent = targetText;
        }
        
        sourceSelect.addEventListener('change', updateShaderNames);
        targetSelect.addEventListener('change', updateShaderNames);
        updateShaderNames();
        
        document.getElementById('sample-shader').addEventListener('click', function() {
            const shaderType = document.getElementById('shader-type').value;
            let sample = '';
            
            if (shaderType === 'fragment') {
                sample = `// Fragment shader example - Gradient color
struct PSInput {
    float4 position : SV_POSITION;
    float2 uv : TEXCOORD0;
};

float4 main(PSInput input) : SV_TARGET {
    // Create a gradient from red to blue
    float3 color = lerp(float3(1.0, 0.0, 0.0), float3(0.0, 0.0, 1.0), input.uv.x);
    return float4(color, 1.0);
}`;
            } else if (shaderType === 'vertex') {
                sample = `// Vertex shader example - Simple transformation
struct VSInput {
    float3 position : POSITION;
    float3 normal : NORMAL;
};

struct VSOutput {
    float4 position : SV_POSITION;
    float3 normal : NORMAL;
};

VSOutput main(VSInput input) {
    VSOutput output;
    output.position = float4(input.position, 1.0);
    output.normal = input.normal;
    return output;
}`;
            }
            
            inputShader.value = sample;
        });
        
        document.getElementById('convert-shader').addEventListener('click', function() {
            const sourceLang = sourceSelect.value;
            const targetLang = targetSelect.value;
            const shader = inputShader.value;
            
            if (!shader.trim()) {
                outputShader.value = "Error: No hay shader para convertir.";
                return;
            }
            
            let converted = `// Shader convertido de ${sourceLang} a ${targetLang}\n`;
            converted += `// Conversión realizada por GameDev Toolkit Plus\n\n`;
            
            if (sourceLang === 'hlsl' && targetLang === 'glsl') {
                converted += `#version 330 core\n\n`;
                converted += shader.replace(/float(\d)/g, 'vec$1')
                                 .replace(/SV_POSITION/g, 'gl_Position')
                                 .replace(/SV_TARGET/g, 'out vec4 fragColor');
            } else if (sourceLang === 'glsl' && targetLang === 'hlsl') {
                converted += shader.replace(/vec(\d)/g, 'float$1')
                                 .replace(/gl_Position/g, 'SV_POSITION')
                                 .replace(/fragColor/g, 'SV_TARGET');
            } else {
                converted += `// Conversión de ${sourceLang} a ${targetLang}\n`;
                converted += `// Nota: La conversión automática puede requerir ajustes manuales\n\n`;
                converted += shader;
            }
            
            outputShader.value = converted;
            showNotification('Shader convertido exitosamente');
        });
        
        document.getElementById('copy-shader').addEventListener('click', function() {
            outputShader.select();
            document.execCommand('copy');
            showNotification('Shader copiado al portapapeles');
        });
    }
    
    function initColorPalette() {
        const colorBase = document.getElementById('color-base');
        const colorHex = document.getElementById('color-hex');
        const paletteType = document.getElementById('palette-type');
        const paletteSize = document.getElementById('palette-size');
        const paletteSizeValue = document.getElementById('palette-size-value');
        
        // Sincronizar color picker y input de texto
        colorBase.addEventListener('input', function() {
            colorHex.value = this.value;
            generatePalette();
        });
        
        colorHex.addEventListener('input', function() {
            if (this.value.match(/^#[0-9A-F]{6}$/i)) {
                colorBase.value = this.value;
                generatePalette();
            }
        });
        
        paletteSize.addEventListener('input', function() {
            paletteSizeValue.textContent = `${this.value} colores`;
        });
        
        document.getElementById('generate-palette').addEventListener('click', generatePalette);
        
        function generatePalette() {
            const baseColor = colorBase.value;
            const type = paletteType.value;
            const size = parseInt(paletteSize.value);
            
            const colors = generateColorPalette(baseColor, type, size);
            const container = document.getElementById('color-container');
            container.innerHTML = '';
            
            colors.forEach((color, index) => {
                const colorItem = document.createElement('div');
                colorItem.className = 'color-item';
                colorItem.innerHTML = `
                    <div class="color-box" style="background-color: ${color.hex};"></div>
                    <div class="color-value">${color.hex}</div>
                `;
                
                colorItem.addEventListener('click', function() {
                    navigator.clipboard.writeText(color.hex);
                    showNotification(`Color ${color.hex} copiado al portapapeles`);
                });
                
                container.appendChild(colorItem);
            });
        }
        
        function generateColorPalette(baseHex, type, size) {
            const colors = [];
            const base = toolData.hexToRgb(baseHex);
            
            for (let i = 0; i < size; i++) {
                let color;
                const factor = i / (size - 1);
                
                switch(type) {
                    case 'monochromatic':
                        color = toolData.adjustLightness(base, 0.2 + factor * 0.6);
                        break;
                    case 'complementary':
                        if (i === 0) {
                            color = base;
                        } else if (i === 1) {
                            color = toolData.getComplementaryColor(base);
                        } else {
                            const isComplementary = i % 2 === 0;
                            const baseColor = isComplementary ? base : toolData.getComplementaryColor(base);
                            const lightness = 0.2 + ((i / 2) / Math.ceil(size / 2)) * 0.6;
                            color = toolData.adjustLightness(baseColor, lightness);
                        }
                        break;
                    case 'random':
                        color = {
                            r: Math.floor(Math.random() * 256),
                            g: Math.floor(Math.random() * 256),
                            b: Math.floor(Math.random() * 256)
                        };
                        break;
                    default:
                        color = {
                            r: Math.min(255, Math.max(0, base.r + Math.floor(Math.random() * 100 - 50))),
                            g: Math.min(255, Math.max(0, base.g + Math.floor(Math.random() * 100 - 50))),
                            b: Math.min(255, Math.max(0, base.b + Math.floor(Math.random() * 100 - 50)))
                        };
                }
                
                colors.push({
                    hex: toolData.rgbToHex(color),
                    rgb: `${color.r}, ${color.g}, ${color.b}`
                });
            }
            
            return colors;
        }
        
        // Generar paleta inicial
        generatePalette();
    }
    
    function initJsonFormatter() {
        const jsonInput = document.getElementById('json-input');
        const jsonResult = document.getElementById('json-result');
        
        document.getElementById('format-json').addEventListener('click', function() {
            try {
                const data = JSON.parse(jsonInput.value);
                jsonResult.textContent = JSON.stringify(data, null, 2);
                showNotification('JSON formateado correctamente');
            } catch(e) {
                jsonResult.textContent = 'Error: JSON inválido\n' + e.message;
                showNotification('Error: JSON inválido', 'error');
            }
        });
        
        document.getElementById('minify-json').addEventListener('click', function() {
            try {
                const data = JSON.parse(jsonInput.value);
                jsonResult.textContent = JSON.stringify(data);
                showNotification('JSON minificado correctamente');
            } catch(e) {
                jsonResult.textContent = 'Error: JSON inválido\n' + e.message;
                showNotification('Error: JSON inválido', 'error');
            }
        });
        
        document.getElementById('validate-json').addEventListener('click', function() {
            try {
                JSON.parse(jsonInput.value);
                jsonResult.textContent = '✓ JSON válido';
                showNotification('JSON válido', 'success');
            } catch(e) {
                jsonResult.textContent = '✗ JSON inválido\n' + e.message;
                showNotification('Error: JSON inválido', 'error');
            }
        });
    }
    
    function initBalanceCalculator() {
        const calculateBtn = document.getElementById('calculate-balance');
        
        calculateBtn.addEventListener('click', function() {
            const type = document.getElementById('balance-type').value;
            const base = parseFloat(document.getElementById('balance-param').value);
            const level = parseInt(document.getElementById('balance-level').value);
            const factor = parseFloat(document.getElementById('balance-factor').value) / 100;
            
            const result = calculateBalance(type, base, level, factor);
            document.getElementById('balance-result').textContent = result;
            showNotification('Balance calculado exitosamente');
        });
        
        function calculateBalance(type, base, level, factor) {
            let result = '';
            
            switch(type) {
                case 'damage':
                    result = `Fórmula de daño por nivel:\n\n`;
                    for(let i = 1; i <= level; i++) {
                        const damage = base * Math.pow(1 + factor, i - 1);
                        result += `Nivel ${i}: ${damage.toFixed(1)} daño\n`;
                    }
                    break;
                    
                case 'health':
                    result = `Fórmula de salud por nivel:\n\n`;
                    for(let i = 1; i <= level; i++) {
                        const health = base * Math.pow(1 + factor, i - 1);
                        result += `Nivel ${i}: ${health.toFixed(1)} salud\n`;
                    }
                    break;
                    
                case 'xp':
                    result = `Fórmula de experiencia por nivel:\n\n`;
                    for(let i = 1; i <= level; i++) {
                        const xp = base * Math.pow(i, 1.5) * (1 + factor);
                        result += `Nivel ${i}: ${Math.floor(xp)} XP requerida\n`;
                    }
                    break;
                    
                case 'economy':
                    result = `Fórmula económica por nivel:\n\n`;
                    for(let i = 1; i <= level; i++) {
                        const gold = base * i * (1 + factor);
                        result += `Nivel ${i}: ${Math.floor(gold)} oro obtenido\n`;
                    }
                    break;
            }
            
            return result;
        }
        
        // Calcular inicialmente
        calculateBtn.click();
    }
    
    function initNameGenerator() {
        const generateBtn = document.getElementById('generate-names');
        const namesResult = document.getElementById('names-result');
        
        generateBtn.addEventListener('click', function() {
            const type = document.getElementById('name-type').value;
            const style = document.getElementById('name-style').value;
            const count = parseInt(document.getElementById('name-count').value);
            
            const names = generateNames(type, style, count);
            namesResult.textContent = names.join('\n');
            showNotification(`${count} nombres generados exitosamente`);
        });
        
        function generateNames(type, style, count) {
            const names = [];
            
            for(let i = 0; i < count; i++) {
                let name = '';
                
                if (type === 'character') {
                    const prefix = toolData.nameParts.character.prefixes[Math.floor(Math.random() * toolData.nameParts.character.prefixes.length)];
                    const mainName = toolData.nameParts.character.names[Math.floor(Math.random() * toolData.nameParts.character.names.length)];
                    const suffix = Math.random() > 0.5 ? ' ' + toolData.nameParts.character.suffixes[Math.floor(Math.random() * toolData.nameParts.character.suffixes.length)] : '';
                    name = `${prefix} ${mainName}${suffix}`;
                } else if (type === 'location') {
                    const locPrefix = toolData.nameParts.location.prefixes[Math.floor(Math.random() * toolData.nameParts.location.prefixes.length)];
                    const locName = toolData.nameParts.location.names[Math.floor(Math.random() * toolData.nameParts.location.names.length)];
                    const locSuffix = Math.random() > 0.5 ? ' ' + toolData.nameParts.location.suffixes[Math.floor(Math.random() * toolData.nameParts.location.suffixes.length)] : '';
                    name = `${locPrefix} ${locName}${locSuffix}`;
                } else {
                    const syllables = ['ar', 'thor', 'mor', 'gan', 'el', 'ea', 'nor', 'vic', 'tor', 'is', 'a', 'bel', 'la'];
                    const nameLength = Math.floor(Math.random() * 3) + 2;
                    
                    for(let j = 0; j < nameLength; j++) {
                        name += syllables[Math.floor(Math.random() * syllables.length)];
                    }
                    
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }
                
                switch(style) {
                    case 'epic':
                        name = name.toUpperCase();
                        break;
                    case 'mysterious':
                        name = `"${name}"`;
                        break;
                    case 'ancient':
                        name = `${name} ${Math.floor(Math.random() * 1000)}`;
                        break;
                }
                
                names.push(name);
            }
            
            return names;
        }
        
        // Generar nombres iniciales
        generateBtn.click();
    }
    
    function initPixelArtEditor() {
        const canvas = document.getElementById('pixel-canvas');
        const ctx = canvas.getContext('2d');
        const pixelColor = document.getElementById('pixel-color');
        const brushSize = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        
        let currentTool = 'pencil';
        let isDrawing = false;
        
        // Inicializar canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar tamaño del pincel
        brushSize.addEventListener('input', function() {
            brushSizeValue.textContent = `${this.value}px`;
        });
        
        // Herramientas
        document.getElementById('pencil-tool').addEventListener('click', function() {
            currentTool = 'pencil';
            updateToolButtons();
        });
        
        document.getElementById('eraser-tool').addEventListener('click', function() {
            currentTool = 'eraser';
            updateToolButtons();
        });
        
        document.getElementById('fill-tool').addEventListener('click', function() {
            currentTool = 'fill';
            updateToolButtons();
        });
        
        function updateToolButtons() {
            document.getElementById('pencil-tool').style.background = currentTool === 'pencil' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)';
            document.getElementById('eraser-tool').style.background = currentTool === 'eraser' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)';
            document.getElementById('fill-tool').style.background = currentTool === 'fill' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)';
        }
        
        // Eventos del canvas
        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            draw(e);
        });
        
        canvas.addEventListener('mousemove', function(e) {
            if (isDrawing) {
                draw(e);
            }
        });
        
        canvas.addEventListener('mouseup', function() {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseleave', function() {
            isDrawing = false;
        });
        
        function draw(e) {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            const size = parseInt(brushSize.value);
            
            if (currentTool === 'pencil') {
                ctx.fillStyle = pixelColor.value;
                ctx.fillRect(x - size/2, y - size/2, size, size);
            } else if (currentTool === 'eraser') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(x - size/2, y - size/2, size, size);
            } else if (currentTool === 'fill') {
                ctx.fillStyle = pixelColor.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        // Limpiar canvas
        document.getElementById('clear-canvas').addEventListener('click', function() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            showNotification('Canvas limpiado');
        });
        
        // Guardar imagen
        document.getElementById('save-canvas').addEventListener('click', function() {
            const link = document.createElement('a');
            link.download = 'pixel-art.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showNotification('Imagen guardada como pixel-art.png');
        });
        
        // Actualizar botones
        updateToolButtons();
    }
    
    // Sistema de notificaciones
    function showNotification(message, type = 'success') {
        // Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'info') icon = 'info-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 184, 148, 0.9)' : 
                         type === 'error' ? 'rgba(225, 112, 85, 0.9)' : 
                         type === 'warning' ? 'rgba(253, 203, 110, 0.9)' :
                         'rgba(116, 185, 255, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards;
        `;
        
        // Agregar keyframes si no existen
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
});