package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;


import static co.com.Mysticalcut.userinterface.AutenticacionBuscarUsuario.MENSAJE_USUARIOS;
import static jxl.biff.FormatRecord.logger;

public class ValidacionBuscarUsuario implements Question<Boolean> {

    public static ValidacionBuscarUsuario ValidacionBuscarUsuario() {return new ValidacionBuscarUsuario(); }


    @Override
    public Boolean answeredBy(Actor actor) {

        try {
            String texto = Text.of(MENSAJE_USUARIOS).viewedBy(actor).asString();
            return "Diana Pérez".equals(texto);
        } catch (Exception e) {
            logger.info(" No encontró el texto o hubo otro error");
            return false;
        }
    }
}
