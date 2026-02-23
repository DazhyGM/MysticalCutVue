package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Scroll;

import static co.com.Mysticalcut.userinterface.autenticacionVerInfoUsuario.*;

public class VerInfoUsuarioAutenticarse implements Task {

    public static VerInfoUsuarioAutenticarse completarCampos(){ return Instrumented.instanceOf(VerInfoUsuarioAutenticarse.class).withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_USUARIO),
                Scroll.to(USUARIO_SCROLL),
                Click.on(BTN_VER_USUARIO)

                );
    }
}