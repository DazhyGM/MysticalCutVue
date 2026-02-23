package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Scroll;

import java.util.List;

import static co.com.Mysticalcut.userinterface.autenticacionVisualizarUsuarios.*;

public class VisualizarUsuariosAutenticarse implements Task {

    public static VisualizarUsuariosAutenticarse completarCampos(){ return Instrumented.instanceOf(VisualizarUsuariosAutenticarse.class).withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_USUARIOS),
                Scroll.to(USUARIOS_SCROLL)



        );
    }
}