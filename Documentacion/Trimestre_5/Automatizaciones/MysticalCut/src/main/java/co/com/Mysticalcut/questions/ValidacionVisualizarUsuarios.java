package co.com.Mysticalcut.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;


import static co.com.Mysticalcut.userinterface.autenticacionVisualizarUsuarios.MENSAJE_USUARIOS1;
import static co.com.Mysticalcut.userinterface.autenticacionVisualizarUsuarios.MENSAJE_USUARIOS2;
import static co.com.Mysticalcut.userinterface.autenticacionVisualizarUsuarios.MENSAJE_USUARIOS3;
import static jxl.biff.FormatRecord.logger;

public class ValidacionVisualizarUsuarios implements Question<Boolean> {

    public static ValidacionVisualizarUsuarios ValidacionVisualizarUsuarios() {return new ValidacionVisualizarUsuarios(); }


    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String nameText1 = Text.of(MENSAJE_USUARIOS1).viewedBy(actor).asString();
            String nameText2 = Text.of(MENSAJE_USUARIOS2).viewedBy(actor).asString();
            String nameText3 = Text.of(MENSAJE_USUARIOS3).viewedBy(actor).asString();

            return "Kevin David Sabogal".equals(nameText1)
            && "Andres Esteban Castañeda".equals(nameText2)
                    && "Oscar Andres Leon".equals(nameText3);

        } catch (Exception e) {
            logger.error("Error validación los campos de información del usuario: ", e);
            return false;
        }
    }
}