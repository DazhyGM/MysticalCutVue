package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.questions.ValidacioneQuotes;
import co.com.Mysticalcut.tasks.Quotes;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class QuotesStepsdefinitions {

    @Cuando("^completa los campos requeridos de servicio, barbero, dia$")
    public void completaLosCamposRequeridosDeServicioBarberoDia() {
        theActorInTheSpotlight().attemptsTo(Quotes.completarCampos());
    }



    @Entonces("^Verificar la orden del servicio$")
    public void verificarLaOrdenDelServicio() {
        theActorInTheSpotlight().should(seeThat(ValidacioneQuotes.validar()));
    }
}
