package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import static jxl.biff.FormatRecord.logger;
import static co.com.Mysticalcut.userinterface.autenticacionRecuperarContrase.MENSAJE_LOGIN;


public class ValidacionRecuperarContrase implements Question<Boolean> {

    public static ValidacionRecuperarContrase ValidacionRecuperarContrase() {return new ValidacionRecuperarContrase();}

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String texto = Text.of(MENSAJE_LOGIN).viewedBy(actor).asString();
            return "Si el correo está registrado, recibirás un enlace de recuperación.".equals(texto);
        } catch (Exception e) {
            logger.info(" No encontró el texto o hubo otro error");
            return false;
        }
    }
}
