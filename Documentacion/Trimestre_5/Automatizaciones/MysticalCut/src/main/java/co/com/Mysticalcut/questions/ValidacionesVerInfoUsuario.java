package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import static co.com.Mysticalcut.userinterface.autenticacionVerInfoUsuario.*;
import static co.com.Mysticalcut.userinterface.autenticacionVerInfoUsuario.MENSAJE_VER_USUARIO;



import static jxl.biff.FormatRecord.logger;

public class ValidacionesVerInfoUsuario implements Question<Boolean>{

    private static final Logger logger = LoggerFactory.getLogger(ValidacionesVerInfoUsuario.class);
    public static ValidacionesVerInfoUsuario ValidacionesVerInfoUsuario() {return new ValidacionesVerInfoUsuario(); }


    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String emailText = Text.of(MENSAJE_VER_USUARIO).viewedBy(actor).asString();
            String nameText = Text.of(MENSAJE_NOMBRE_INPUT).viewedBy(actor).asString();
            String TelefonoText = Text.of(MENSAJE_TELEFONO_INPUT).viewedBy(actor).asString();


            return "Correo Electrónico".equals(emailText)
            && "Nombres y Apellidos".equals(nameText)
                    && "Teléfono".equals(TelefonoText);

        } catch (Exception e) {
            logger.error("Error validación los campos de información del usuario: ", e);
            return false;
        }
    }
}