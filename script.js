function typeWriter(elementId, text, speed = 100) {
    let i = -7;
    const element = document.getElementById(elementId);
    element.innerHTML = ""; // clear existing content

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}


document.addEventListener("DOMContentLoaded", function () {
    typeWriter("typewriter-text", "Exploring the mysteries of the universe, one galaxy at a time", 100);
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultTarget = 'about';
    const defaultButton = document.querySelector(`[data-target="${defaultTarget}"]`);
    const defaultContent = document.getElementById(`content-${defaultTarget}`);

    const isSmallScreen = () => window.innerWidth <= 768; // Adjust breakpoint if needed

    const showCaption = (caption) => {
        caption.style.opacity = '1';
        caption.style.visibility = 'visible';
        caption.style.transform = isSmallScreen() ? 'translateY(10px)' : 'translateX(-20px)';
    };

    const hideAllCaptions = () => {
        document.querySelectorAll('.icon-caption').forEach(caption => {
            caption.style.opacity = '0';
            caption.style.visibility = 'hidden';
            caption.style.transform = 'translate(0)';
        });
    };

    if (defaultButton && defaultContent) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.icon-button').forEach(btn => {
            btn.classList.remove('selected');
        });

        defaultContent.classList.add('active');
        defaultButton.classList.add('selected');

        const iconWrapper = defaultButton.closest('.icon-wrapper');
        if (iconWrapper) {
            const caption = iconWrapper.querySelector('.icon-caption');
            if (caption) showCaption(caption);
        }
    }

    document.querySelectorAll('.icon-button').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');

            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            document.querySelectorAll('.icon-button').forEach(btn => {
                btn.classList.remove('selected');
            });

            hideAllCaptions();

            const contentToShow = document.getElementById(`content-${target}`);
            if (contentToShow) {
                contentToShow.classList.add('active');
                button.classList.add('selected');
            }

            const iconWrapper = button.closest('.icon-wrapper');
            if (iconWrapper) {
                const caption = iconWrapper.querySelector('.icon-caption');
                if (caption) showCaption(caption);
            }
        });
    });

    // Optional: Handle window resize to update transform if screen size changes dynamically
    window.addEventListener('resize', () => {
        document.querySelectorAll('.icon-button.selected').forEach(button => {
            const iconWrapper = button.closest('.icon-wrapper');
            if (iconWrapper) {
                const caption = iconWrapper.querySelector('.icon-caption');
                if (caption) showCaption(caption);
            }
        });
    });
});





