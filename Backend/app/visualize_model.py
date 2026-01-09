# from sqlalchemy_schemadisplay import create_schema_graph
# from sqlalchemy import create_engine
# from db import Base
# import asyncio

# async def main():
#     from db import create_db_and_tables
#     await create_db_and_tables()
    
#     print("Generating schema diagram...")
    
#     # Create synchronous engine for schema display
#     sync_engine = create_engine("sqlite+aiosqlite:///./test.db", echo=False)
    
#     # Create the graph
#     graph = create_schema_graph(
#         metadata=Base.metadata,
#         show_datatypes=True,
#         show_indexes=True,
#         rankdir='LR',  # Left to Right layout
#         concentrate=False,
#         engine=sync_engine
#     )
    
#     # Save as PNG
#     graph.write_png('database_schema.png')
#     print("✓ Schema saved: database_schema.png")
    
#     # Save as PDF
#     graph.write_pdf('database_schema.pdf')
#     print("✓ Schema saved: database_schema.pdf")
    
#     print("\n✅ Done! Open database_schema.png to view your schema.")

# if __name__ == "__main__":
#     asyncio.run(main())

# =----------------------------------------------------------------------------------=
# not woking code above.
