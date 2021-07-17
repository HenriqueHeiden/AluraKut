import React from 'react';
import MainGrid from '../src/componentes/MainGrid';
import Box from '../src/componentes/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/componentes/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://githut.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual}`} >
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>

    </ProfileRelationsBoxWrapper>
  );
}

function PeopleCommunity(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`/users${itemAtual}`}>
                <img src={`https://github.com/${itemAtual}.png`} />
                <span>{itemAtual}</span>

              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

function ComunnityRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/comunidades/${itemAtual.id}`} >
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const usuarioAletorio = 'hheiden';
  const [comunidades, setComunidades] = React.useState([]);

  const pessoasFavoritas = ['juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho']

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (repostaCompleta) {
        setSeguidores(repostaCompleta);
      }),

      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Authorization': '0f2e21956dcfd654845fc3cad1ace0',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "query":
            `query{
          allCommunities {
            id,
            title,
            imageUrl,    
          }
        }` })
      })
        .then((response) => response.json())
        .then((respostaCompleta) => {
          const comonidadesVindaDoDato = respostaCompleta.data.allCommunities;
          setComunidades(comonidadesVindaDoDato);
        })


  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAletorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box >
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">Oque você deseja fazer?</h2>
            <form onSubmit={function handleCriarComuniodade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image')
              }

              //if (comunidade.titulo && comunidade.image) {
                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    console.log(dados.registroCriado);
                    const comunidade = dados.registroCriado;
                    const comunidadesAtualizadas = [...comunidades, comunidade];
                    setComunidades(comunidadesAtualizadas)
                  })
              //}
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  arial-label="Qual vai ser o nome da sua comiunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  arial-label="Qual vai ser o nome da sua comiunidade?"
                  type="text"
                />
              </div>

              <button>
                Criar uma comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ComunnityRelationsBox title={"Comunidades"} items={comunidades} />
          <PeopleCommunity title={"Pessoas da Comunidade"} items={pessoasFavoritas} />

        </div>
      </MainGrid>
    </>
  );
}
