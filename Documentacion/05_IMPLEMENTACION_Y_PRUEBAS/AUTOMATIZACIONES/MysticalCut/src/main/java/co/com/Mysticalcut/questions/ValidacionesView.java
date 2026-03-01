package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.Mysticalcut.userinterface.View.MENSAJE_VIEW_DESCRIP;
import static co.com.Mysticalcut.userinterface.View.MENSAJE_VIEW_SERVICE;

public class ValidacionesView implements Question<Boolean> {

    private static final Logger logger = LoggerFactory.getLogger(ValidacionesView.class);

    public static ValidacionesView validar() {
        return new ValidacionesView();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String descripcionText = Text.of(MENSAJE_VIEW_DESCRIP).viewedBy(actor).asString();
            String servicioText = Text.of(MENSAJE_VIEW_SERVICE).viewedBy(actor).asString();

            return "Descripción: Corte tradicional con acabado limpio y elegante.".equals(descripcionText)
                    && "Corte Clásico".equals(servicioText);

        } catch (Exception e) {
            logger.error("Error validando los textos en la vista del servicio: ", e);
            return false;
        }
    }
}