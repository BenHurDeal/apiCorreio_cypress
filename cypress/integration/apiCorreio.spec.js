/// <reference types="cypress" />

import objetoCapitaisCep from '../fixtures/capitaisCep.json';
import arrayResponseCapitais from '../fixtures/responsesCapitais.json';

describe('Cenário de testes da api cep-correios', () => {

    Object.keys(objetoCapitaisCep).forEach((capitalAtual) => {
        it(`Valida dados do CEP da capital: ${capitalAtual}`, { env: { hideCredentials: true } }, () => {
            cy.request({
                method: 'GET',
                url: Cypress.env('baseUrl') + `${objetoCapitaisCep[capitalAtual]}`,
                headers: { Cookie: Cypress.env('Cookie') }
            }).then(({ status, body }) => {
                const {
                    address, restrictions, number, city, longitude, state,
                    id, complement, latitude, neighborhood, blockDelivery } = body;

                const filtrarCapitalAtual = arrayResponseCapitais.filter((responseCapitalFixture) => responseCapitalFixture.city === capitalAtual)
                filtrarCapitalAtual.forEach((matchCapital) => {

                    expect(status).to.be.eq(200)
                    expect(address).to.be.eq(matchCapital.address)
                    expect(restrictions).to.be.deep.eq(matchCapital.restrictions)
                    expect(number).to.be.eq(matchCapital.number)
                    expect(city).to.be.eq(matchCapital.city)
                    expect(longitude).to.be.eq(matchCapital.longitude)
                    expect(state).to.be.eq(matchCapital.state)
                    expect(id).to.be.eq(matchCapital.id)
                    expect(complement).to.be.eq(matchCapital.complement)
                    expect(latitude).to.be.eq(matchCapital.latitude)
                    expect(neighborhood).to.be.eq(matchCapital.neighborhood)
                    expect(blockDelivery).to.be.eq(matchCapital.blockDelivery)
                })
            })
        })
    });

    context('Fluxos inválidos', () => {

        it('CEP com traço', () => {
            Cypress.Commands.add('getCep', (cep, msg, sttsCode) => {
                cy.request({
                    method: 'GET',
                    url: Cypress.env('baseUrl') + cep,
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(sttsCode)
                    expect(body.message).to.equal(msg)
                    expect(body.errorCode).to.equal('400')
                })
            })
            cy.getCep('66917-190', 'Requisição mal formatada', 400)
        });

        it('CEP com letras', () => {
            cy.getCep('6D6TR43W', 'Requisição mal formatada', 400)
        });

        it('CEP vazio', () => {
            cy.getCep('', 'Parâmetro CEP obrigatório', 400)
        });
    })

});