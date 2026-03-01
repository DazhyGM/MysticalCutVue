package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.Mysticalcut.userinterface.QuotesCancel.*;

public class ValidacionesQuotesCancel implements Question<Boolean> {

    private static final Logger logger = LoggerFactory.getLogger(ValidacionesQuotesCancel.class);

    public static ValidacionesQuotesCancel validar() {
        return new ValidacionesQuotesCancel();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String estado = Text.of(MENSAJEQUOTESCANCEL).viewedBy(actor).asString();
            String email = Text.of(MENSAJEQUOTESCANCEL_EMAIL).viewedBy(actor).asString();
            String barber = Text.of(MENSAJEQUOTESCANCEL_BARBER).viewedBy(actor).asString();
            String servicio = Text.of(MENSAJEQUOTESCANCEL_SERVICES).viewedBy(actor).asString();

            return "cancelada".equals(estado)
                    && "Bot-services@gmail.com".equals(email)
                    && "Alberto Díaz".equals(barber)
                    && "Corte Clásico".equals(servicio);
        } catch (Exception e) {
            logger.error("Error validando los textos de la cotización cancelada: ", e);
            return false;
        }
    }
}
