package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import static co.com.Mysticalcut.userinterface.Autenticacion.MENSAJE_LOGIN;
import static jxl.biff.FormatRecord.logger;

public class ValidacionLogin implements Question<Boolean> {

    public static ValidacionLogin validacionLogin() {
        return new ValidacionLogin();
    }

    @Override
    public Boolean answeredBy(Actor actor) {

        try {
            String texto = Text.of(MENSAJE_LOGIN).viewedBy(actor).asString();
            return "Kevin David Sabogal".equals(texto);
        } catch (Exception e) {
            logger.info(" No encontró el texto o hubo otro error");
            return false;
        }
    }
}
