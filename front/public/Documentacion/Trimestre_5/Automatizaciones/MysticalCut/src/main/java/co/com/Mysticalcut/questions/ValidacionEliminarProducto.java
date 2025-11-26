package co.com.Mysticalcut.questions;


import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import static co.com.Mysticalcut.userinterface.EliminarProducto.MENSAJE_VIEW_PRODUCTS_ELIMINAR;
import static jxl.biff.FormatRecord.logger;

public class ValidacionEliminarProducto implements Question<Boolean> {


    public static ValidacionEliminarProducto Validacion() {return new ValidacionEliminarProducto(); }


    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String ProductsText = Text.of(MENSAJE_VIEW_PRODUCTS_ELIMINAR).viewedBy(actor).asString();
            return "Tratamiento de Keratina".equals(ProductsText);

        } catch (Exception e) {
            logger.error("Error validando los textos en la vista del servicio: ", e);
            return false;
        }
    }
}
