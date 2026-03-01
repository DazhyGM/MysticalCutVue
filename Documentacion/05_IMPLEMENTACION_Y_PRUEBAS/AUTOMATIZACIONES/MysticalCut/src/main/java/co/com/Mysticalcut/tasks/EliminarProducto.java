package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.Mysticalcut.userinterface.EliminarProducto.*;


public class EliminarProducto implements Task {

    public static EliminarProducto completarCampos() {return Instrumented.instanceOf(EliminarProducto.class).withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_PRODUCTS),
                Click.on(BTN_PRODUCTS_ELIMINAR),
                Alerts.Alert(),
                Click.on(BTN_INACTIVE_PRODUCTS)
        );
    }
}