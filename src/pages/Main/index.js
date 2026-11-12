import React, {useState, useCallback, useEffect} from 'react';
import {FaGithub, FaPlus,FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import {Link} from 'react-router-dom'

import api from '../../services/api';


export default function Main(){
    // Cada estado representa uma parte independente da interface da tela.
    const [newRepo, setNewRepo] = useState('') ;
    const [repositorios, setRepositorios] = useState(() => {
    // O inicializador lazy evita ler o localStorage novamente a cada renderização.
    const repoStorage = localStorage.getItem('repos');
    return repoStorage ? JSON.parse(repoStorage) : [];
    });
    const [loading, setLoading] = useState(false)
    const[alert, setAlert] = useState(null)

    // Reidrata a lista quando o componente é montado, recuperando dados da sessão anterior.
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos')
        
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])

    // Persiste automaticamente a lista sempre que ela muda.
    useEffect(() =>{

        localStorage.setItem('repos', JSON.stringify(repositorios))
    }, [repositorios])

    
    
    const handleSubmit= useCallback((e)=>{
        e.preventDefault()

        async function submit(){
            setLoading(true)
            try{
            // A validação acontece antes da chamada para evitar requisições inválidas.
            if(newRepo ===''){
                throw new Error("Você precisa indicar um repositório!")
            }

            // O Axios usa a baseURL configurada no serviço para consultar o GitHub.
            const response = await api.get(`repos/${newRepo}`)

            // Evita inserir o mesmo repositório mais de uma vez na lista local.
            const hasRepo = repositorios.find(repo => repo.name === newRepo)

            if(hasRepo){
                throw new Error("Repositório já listado! Digite outro")
            }

            const data = {
                name: response.data.full_name, 

        }

            // O novo item é criado sem mutar o array anterior, seguindo o padrão do React.
            setRepositorios([...repositorios, data])
            setNewRepo('')
            }catch(error){
                setAlert(true)
                console.log(error)
            }finally{
                setLoading(false)
            }

            
        }

        submit()
    }, [newRepo, repositorios])


    function handleinputChange(e){
        // Atualiza o campo controlado e limpa o estado de erro assim que o usuário digita.
        setNewRepo(e.target.value);
        setAlert(null)
    }
    const handleDelete = useCallback((repo)=>{
        // filter cria uma nova lista contendo todos os itens, exceto o selecionado.
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios]);

    return(
        <Container>
           
          
           <h1>
                <FaGithub size={28}/>
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                    type='text' 
                    placeholder='Adicionar Repositórios'
                    value={newRepo}
                    onChange={handleinputChange}
                />
                <SubmitButton loading={loading ? 1: 0}>
                    {loading ?
                        (<FaSpinner  color='#FFF' size={14}/>)
                        :(
                        <FaPlus color='#FFF' size={14}/>
                        )       
                    }
                </SubmitButton>
            </Form>

            <List>
                {/* O React usa key para identificar cada item durante atualizações da lista. */}
                {repositorios.map(repo =>(

                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repo.name}</span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>

                ))}

            </List>

        </Container>
    )

}