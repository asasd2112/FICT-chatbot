from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import Replicate
from PyPDF2 import PdfReader
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
import os

def initialize_faiss():
    pdf_path = "Data.pdf"
    faiss_index_path = "faiss_index"

    # Check if FAISS index already exists
    if os.path.exists(faiss_index_path):
        # Load the existing FAISS index
        model_name = "BAAI/bge-large-en-v1.5"
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': True}
        model = HuggingFaceBgeEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs,
        )
        document_search = FAISS.load_local(faiss_index_path, model, allow_dangerous_deserialization=True)
    else:
        # Read text from PDF
        pdfreader = PdfReader(pdf_path)
        raw_text = ''
        for i, page in enumerate(pdfreader.pages):
            content = page.extract_text()
            if content:
                raw_text += content

        # Split the text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=500)
        texts = text_splitter.split_text(raw_text)

        # Create the FAISS index
        model_name = "BAAI/bge-large-en-v1.5"
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': True}
        model = HuggingFaceBgeEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs,
        )
        document_search = FAISS.from_texts(texts, model)

        # Save the FAISS index
        document_search.save_local(faiss_index_path)

    return document_search.as_retriever()

def rag_llm(input: str, retriever):
    try:
        llm = Replicate(
            model="meta/meta-llama-3-70b-instruct",
            model_kwargs={"temperature": 0.0, 'max_new_tokens': 4048, 'context_length': 4000, "top_p": 1},
        )

        template = """You are FICT Chat-bot. Created by CS students Ahmed, Aqib, and Meerak. Don't start your statement with 'According to the provided context' or 'Based on the provided context'. Answer the question based only on the following context:
        {context}

        Question: {question}
        """
        prompt = ChatPromptTemplate.from_template(template)
        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        output = chain.invoke(input)
        
        # Ensure the output is a string or JSON-serializable
        if not isinstance(output, str):
            output = str(output)

        return output

    except Exception as e:
        print(f"Error: {e}")
        return "\nAn error occurred during processing."
