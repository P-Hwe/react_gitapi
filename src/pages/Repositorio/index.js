import React, { useEffect, useState } from 'react';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import api from '../../services/api';

const filters = [
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: false}
];

export default function Repositorio() { // 1. Removido o {match} daqui
    
    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const { repositorio: repoParam } = useParams(); // Você já criou o repoParam aqui!
    const [page, setPage] = useState(1);
    const[filterIndex, serFilterIndex] = useState(0)


    useEffect(() => {
        async function load() {
            const nomeRepo = decodeURIComponent(repoParam);

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                    
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    }, [repoParam]);

    useEffect(() => {
        async function loadIssue() {
            // 2. Trocado match.params.repositorio por repoParam
            const nomeRepo = decodeURIComponent(repoParam);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page, 
                    per_page: 5,
                },
            });

            setIssues(response.data);
        }

        loadIssue();
    }, [filterIndex, repoParam, page]); // 3. Atualizado aqui também nas dependências
    
    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1);
    }
    function handleFilter(index){
        serFilterIndex(index)
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando</h1>
                <FaSpinner color='#FFF' size={30} />
            </Loading>
        );
    }

    return (
        <Container>
            <BackButton to={"/"}>
                <FaArrowLeft color="#000" size={26} />
            </BackButton>
            
            <Owner>
                <img 
                    src={repositorio.owner.avatar_url}
                    alt={repositorio.owner.login}
                />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>
            <FilterList active={filterIndex}>
                {filters.map((filter, index)=>(
                    <button
                        type='button'
                        key={filter.label}
                        onClick={()=>handleFilter(index)}
                    >
                        {filter.label}
                    </button>


                ))}

            </FilterList>
            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button 
                    type="button" 
                    onClick={() => handlePage('back')} 
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage('next')}>
                    Próxima
                </button>
            </PageActions>
        </Container>
    );
}
