package co.com.Mysticalcut.questions;


import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import static co.com.Mysticalcut.userinterface.VerProducto.MENSAJE_VIEW_DESCRIP;
import static co.com.Mysticalcut.userinterface.VerProducto.MENSAJE_VIEW_PRODUCTS;
import static jxl.biff.FormatRecord.logger;

public class ValidacionVerProducto implements Question<Boolean> {


    public static ValidacionVerProducto Validacion() {return new ValidacionVerProducto(); }


    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String ProductsText = Text.of(MENSAJE_VIEW_PRODUCTS).viewedBy(actor).asString();
            return "Productos".equals(ProductsText);

        } catch (Exception e) {
            logger.error("Error validando los textos en la vista del servicio: ", e);
            return false;
        }
    }
}
