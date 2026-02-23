package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.Mysticalcut.userinterface.Quotes.*;
import static co.com.Mysticalcut.userinterface.Quotes.MENSAJE_QUOTES_BARBER;

public class ValidacioneQuotes implements Question<Boolean> {

    private static final Logger logger = LoggerFactory.getLogger(ValidacioneQuotes.class);

    public static ValidacioneQuotes validar() {
        return new ValidacioneQuotes();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String emailText = Text.of(MENSAJE_QUOTES_EMAIL).viewedBy(actor).asString();
            String servicesText = Text.of(MENSAJE_QUOTES_SERVICES).viewedBy(actor).asString();
            String barberText = Text.of(MENSAJE_QUOTES_BARBER).viewedBy(actor).asString();

            return "Bot-services@gmail.com".equals(emailText)
                    && "Corte Clásico".equals(servicesText)
                    && "Alberto Díaz".equals(barberText);

        } catch (Exception e) {
            logger.error("Error validando los textos de la cotización: ", e);
            return false;
        }
    }
}
