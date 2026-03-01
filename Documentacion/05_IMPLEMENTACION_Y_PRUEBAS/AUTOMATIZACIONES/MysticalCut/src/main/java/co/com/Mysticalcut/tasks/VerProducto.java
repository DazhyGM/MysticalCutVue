package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.Mysticalcut.userinterface.VerProducto.*;


public class VerProducto implements Task {

    public static VerProducto completarCampos() {return Instrumented.instanceOf(VerProducto.class).withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_PRODUCTS)
        );
    }
}